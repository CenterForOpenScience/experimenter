import Ember from 'ember';
import {adminPattern, makeUserPattern} from  '../../utils/patterns';

// FIXME: Known bug in original- if the server save request fails, the value will appear to have been added until page reloaded.
//  (need to catch and handle errors)

/**
 * Display all users that match a provided user type, and allow adding/removing of new user IDs
 *
 * Sample usage:
 * ```handlebars
 * {{permissions-editor
 *   userPermissions
 *   displayFilterPattern=accountPattern
 *   newPermissionLevel=permissionsLevel
 *   changePermissions=(action 'changePermissions')}}
 * ```
 *
 * @class permissions-editor
 */
let PermissionsEditor = Ember.Component.extend({
    session:  Ember.inject.service(),
    tagName: 'table',
    classNames: ['table'],

    warn: false,
    removeTarget: null,

    newPermissionLevel: 'ADMIN',

    /**
     * @property {String} displayFilterPattern Filter the list of known permissions to only those that match the
     *   specified pattern. Can be used to restrict to OSF users, Jam users associated with a collection, etc.
     *   This pattern is also used to *add* new users of the specified type.
     *
     */
    displayFilterPattern: adminPattern,

    // Filter permissions to those that match the provided pattern, and extract usernames for display
    usersList: Ember.computed('displayFilterPattern', 'permissions', function() {
        const permissions = this.get('permissions');
        const pattern = makeUserPattern(this.get('displayFilterPattern'));
        return Object.keys(permissions).map((key) => {
            const match = pattern.exec(key);
            return match ? match[1] : null;
        }).filter(match => !!match
        ).sort();
    }),

    actions: {
        addPermission() {
            const userId = this.get('newUserId');
            let permissions = Ember.copy(this.get('permissions'), true);
            permissions[`${this.get('displayFilterPattern')}-${userId}`] = this.get('newPermissionLevel');
            this.set('newUserId', '');

            this.sendAction('changePermissions', permissions);
            this.set('permissions', permissions);
            this.rerender();
        },

        removePermission(userId) {
            const currentUserId = this.get('session.data.authenticated.id');
            if (userId === currentUserId) {
                this.set('warn', true);
                this.set('removeTarget', userId);
            } else {
                this.send('_removePermission', userId);
            }
        },
        _removePermission(userId) {
            userId = userId || this.get('removeTarget');

            const selector = `${this.get('displayFilterPattern')}-${userId}`;
            const permissions = Ember.copy(this.get('permissions'));

            delete permissions[selector];
            this.sendAction('changePermissions', permissions);
            this.set('permissions', permissions);
            const currentUserId = this.get('session.data.authenticated.id');
            if (userId === currentUserId) {
                this.get('session').invalidate();
                window.location.reload();
            } else {
                // TODO: Is rerender necessary?
                this.rerender();
            }
        }
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions']
});

export default PermissionsEditor;

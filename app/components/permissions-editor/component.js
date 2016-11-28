import Ember from 'ember';
import {adminPattern, makeUserPattern} from  '../../utils/patterns';

// FIXME: Known bug in original- if the server save request fails, the value will appear to have been added until page reloaded.
//  (need to catch and handle errors)
let PermissionsEditor = Ember.Component.extend({
    session:  Ember.inject.service(),
    tagName: 'table',
    classNames: ['table'],

    warn: false,
    removeTarget: null,

    newPermissionLevel: 'ADMIN',
    newPermissionSelector: '',

    /**
     * @property {String} displayFilterPattern Filter the list of known permissions to only those that match the
     * specified pattern. Can be used to restrict to OSF users, Jam users associated with a collection, etc.
     *
     */
    displayFilterPattern: adminPattern,

    usersList: Ember.computed('permissions', function() {
        var permissions = this.get('permissions');

        // Assumption: all properties passed into this page will match admin pattern
        const pattern = makeUserPattern(this.get('displayFilterPattern'));
        return Object.keys(permissions).map((key) => {
            const match = pattern.exec(key);
            return match ? match[1] : null;
        }).filter(match => !!match);
    }),

    actions: {
        addPermission() {
            var userId = this.get('newUserId');
            var permissions = Ember.copy(this.get('permissions'));
            permissions[`user-osf-${userId}`] = this.get('newPermissionLevel');
            this.set('newUserId', '');
            this.sendAction('changePermissions', permissions);
            this.set('permissions', permissions);
            this.rerender();
        },

        removePermission(userId) {
            var currentUserId = this.get('session.data.authenticated.id');
            if (userId === currentUserId) {
                this.set('warn', true);
                this.set('removeTarget', userId);
            } else {
                this.send('_removePermission', userId);
            }
        },
        _removePermission(userId) {
            userId = userId || this.get('removeTarget');

            var selector = `user-osf-${userId}`;
            var permissions = Ember.copy(this.get('permissions'));

            delete permissions[selector];
            this.sendAction('changePermissions', permissions);
            this.set('permissions', permissions);

            var currentUserId = this.get('session.data.authenticated.id');
            if (userId === currentUserId) {
                this.get('session').invalidate();
                window.location.reload();
            } else {
                this.rerender();
            }
        }
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions']
});

export default PermissionsEditor;

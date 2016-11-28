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
 *   changePermissions=(action 'changePermissions')}}
 * ```
 *
 * @class permissions-editor
 */
let PermissionsEditor = Ember.Component.extend({
    session:  Ember.inject.service(),
    store: Ember.inject.service(),

    tagName: 'table',
    classNames: ['table'],

    warn: false,
    removeTarget: null,

    /**
     * If a valid string is provided, then this will attempt to set permissions on a collection instead of a namespace
     * @property {String} collectionTarget
     */
    collectionTarget: null,

    newPermissionLevel: 'ADMIN',
    newPermissionSelector: '',

    /**
     * @property {String} displayFilterPattern Filter the list of known permissions to only those that match the
     * specified pattern. Can be used to restrict to OSF users, Jam users associated with a collection, etc.
     *
     */
    displayFilterPattern: adminPattern,


    /**
     * Get a record
     * @method getOrPeek
     * @param {String} recordName The ID of the specific item, eg the name of the desired collection
     * @param {String} modelName (optional) What kind of record to fetch- collection, namespace, or one record ID
     * @returns {DS.Model|null} A promise that resolves to a model or a null value
     */
    getOrPeek(modelName, recordName) {
        const store = this.get('store');
        if (!recordName) {
            return Ember.RSVP.resolve(null);
        }
        return store.peekRecord(modelName, recordName) || store.findRecord(modelName, recordName);
    },

    /**
     * If a target collection is specified, use that model
     */
    _collectionTargetModel: Ember.computed('collectionTarget', function() {
        return this.getOrPeek('collection', this.get('collectionTarget'));
    }),

    usersList: Ember.computed('permissions', function() {
        const permissions = this.get('permissions');

        // Assumption: all properties passed into this page will match admin pattern
        const pattern = makeUserPattern(this.get('displayFilterPattern'));
        return Object.keys(permissions).map((key) => {
            const match = pattern.exec(key);
            return match ? match[1] : null;
        }).filter(match => !!match);
    }),

    actions: {
        addPermission() {
            const userId = this.get('newUserId');
            let permissions = Ember.copy(this.get('permissions'));
            permissions[`${this.get('displayFilterPattern')}-${userId}`] = this.get('newPermissionLevel');
            this.set('newUserId', '');

            this.get('_collectionTargetModel').then(model => {
                this.sendAction('changePermissions', permissions, model);
                this.set('permissions', permissions);
                this.rerender();
            });

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
            this.get('_collectionTargetModel').then(model => {
                this.sendAction('changePermissions', permissions, model);
                this.set('permissions', permissions);
                const currentUserId = this.get('session.data.authenticated.id');
                if (userId === currentUserId) {
                    this.get('session').invalidate();
                    window.location.reload();
                } else {
                    this.rerender();
                }
            });
        }
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions']
});

export default PermissionsEditor;

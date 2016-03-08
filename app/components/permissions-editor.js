import Ember from 'ember';
import {adminPattern} from  '../utils/patterns';

// FIXME: Known bug in original- if the server save request fails, the value will appear to have been added until page reloaded.
//  (need to catch and handle errors)
let PermissionsEditor = Ember.Component.extend({
    tagName: 'table',
    classNames: ['table'],

    newPermissionLevel: 'ADMIN',
    newPermissionSelector: '',

    usersList: Ember.computed('permissions', function() {
        var permissions = this.get('permissions');

        // Assumption: all properties passed into this page will match admin pattern
        return Object.getOwnPropertyNames(permissions).map(function(key){
            return adminPattern.exec(key)[1];
        });
    }),

    actions: {
        addPermission() {
            var userId = this.get('newUserId');
            var permissions = Ember.copy(this.get('permissions'));
            permissions[`user-osf-${userId}`] = this.get('newPermissionLevel');
            this.set('newUserId', '');
            this.sendAction('onchange', permissions);
            this.set('permissions', permissions);
            this.rerender();

        },

        removePermission(userId) {
            var selector = `user-osf-${userId}`;
            var permissions = Ember.copy(this.get('permissions'));

            delete permissions[selector];
            this.sendAction('onchange', permissions);
            this.set('permissions', permissions);
            this.rerender();
        }
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions']
});


export default PermissionsEditor;

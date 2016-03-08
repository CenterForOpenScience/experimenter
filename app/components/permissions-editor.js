import Ember from 'ember';

// FIXME: Known bug in original- if the server save request fails, the value will appear to have been added until page reloaded.
//  (need to catch and handle errors)
let PermissionsEditor = Ember.Component.extend({
    tagName: 'table',
    classNames: ['table'],
    permissionLevels: [
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'ADMIN'
    ],

    newPermissionLevel: 'ADMIN',
    newPermissionSelector: '',

    actions: {
        addPermission() {
            var userId = this.get('newUserId');

            this.permissions[`user-osf-${userId}`] = this.get('newPermissionLevel');
            this.set('newUserId', '');
            this.rerender();
            this.sendAction('onchange', this.get('permissions'));
        },

        removePermission(userId) {  // TODO: use same template as above
            var selector = `user-osf-${userId}`;
            delete this.permissions[selector];
            this.rerender();
            this.sendAction('onchange', this.get('permissions'));
        }
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions']
});


export default PermissionsEditor;

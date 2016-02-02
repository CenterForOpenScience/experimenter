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
        'ADMIN',
    ],

    newPermissionLevel: 'CREATE',
    newPermissionSelector: '',

    actions: {
        addPermission() {
            this.permissions[this.get('newPermissionSelector')] = this.get('newPermissionLevel');
            this.set('newPermissionSelector', '');
            this.rerender();
            this.get('onchange')(this.get('permissions'));
        },

        removePermission(selector) {
            delete this.permissions[selector];
            this.rerender();
            this.get('onchange')(this.get('permissions'));
        },
    }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions'],
});


export default PermissionsEditor;

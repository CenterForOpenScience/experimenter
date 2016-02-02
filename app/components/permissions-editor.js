import Ember from 'ember';

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
    }
  }
});

PermissionsEditor.reopenClass({
    positionalParams: ['permissions'],
});


export default PermissionsEditor;

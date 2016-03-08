import Ember from 'ember';

// Admin users are those authenticated via OSF
var adminPattern = new RegExp(/^user-osf-(\w+|\*)$/);

export default Ember.Controller.extend({
    filteredPermissions: Ember.computed('model', function() {
        var permissions = this.get('model.permissions');
        var users = {};
        var system = {};
        for (let k of Object.getOwnPropertyNames(permissions)) {
            var dest = adminPattern.test(k) ? users : system;
            dest[k] = permissions[k];
        }
        return [users, system];
    }),

    /* Return permissions strings that correspond to admin users (those who log in via OSF) */
    userPermissions:  Ember.computed('filteredPermissions', function() {
        var filtered = this.get('filteredPermissions');
        return filtered[0];
    }),

    /* Return permissions strings that do not match OSF users */
    systemPermissions:  Ember.computed('filteredPermissions', function() {
        var filtered = this.get('filteredPermissions');
        return filtered[1];
    }),

    actions: {
        permissionsUpdated(permissions) {
            // Save updated permissions, and avoid overwriting system-level permissions not displayed to the user

            var payload = Object.assign({}, permissions, this.get('systemPermissions'));
            console.log('permissions', this.get('userPermissions'), this.get('systemPermissions'), payload);
            this.set('model.permissions', payload);
            this.get('model').save();
        }
    }
});

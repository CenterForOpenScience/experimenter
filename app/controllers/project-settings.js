import Ember from 'ember';
import {adminPattern, makeUserPattern} from  '../utils/patterns';

import config from 'ember-get-config';

export default Ember.Controller.extend({

    queryParams: ['collection'],
    collection: '',

    namespaceConfig: Ember.inject.service(),
    namespace: Ember.computed.alias('namespaceConfig.namespace'),

    breadCrumb: 'Project configuration',

    osfURL: config.OSF.url,

    // List of collection names for which we will allow the user to add read-only Jam-authenticated users
    availableCollections: ['accounts'],

    // Define the username format, eg Jam-authenticated users vs OSF provider
    userPattern: Ember.computed('namespace', 'collection', function () {
        const collection = this.get('collection');
        if (collection) {
            return `jam-${this.get('namespace')}:accounts`;
        }
        return adminPattern;
    }),

    // For now, we will only let users add ADMINS to the namespace (must be OSF users), and only grant READ-ONLY access
    //   to collections (where the new users will be Jam authenticated users)
    permissionsLevel: Ember.computed('collection', function () {
        if (this.get('collection')) {
            return 'READ';
        }
        return 'ADMIN';
    }),

    // TODO: Can we rip all of this out and let only the selector widget control display logic?
    filteredPermissions: Ember.computed('model', 'userPattern', function() {
        const permissions = this.get('model.permissions');
        let users = {};
        let system = {};

        let pattern = makeUserPattern(this.get('userPattern'));
        for (let k of Object.keys(permissions)) {
            const dest = pattern.test(k) ? users : system;
            dest[k] = permissions[k];
        }
        return [users, system];
    }),

    // Return permissions strings that correspond to recognized user types
    _userPermissions:  Ember.computed('filteredPermissions', function() {
        let filtered = this.get('filteredPermissions');
        return filtered[0];
    }),
    userPermissions: Ember.computed.readOnly('_userPermissions'), // TODO: is this necessary?

    /* Return permissions strings that do not match OSF users */
    systemPermissions:  Ember.computed('filteredPermissions', function() {
        let filtered = this.get('filteredPermissions');
        return filtered[1];
    }),

    actions: {
        changePermissions(permissions) {
            // Save updated permissions, and avoid overwriting system-level permissions not displayed to the user
            let model = this.get('model');
            let payload = Object.assign({}, permissions, this.get('systemPermissions'));
            model.set('permissions', payload);
            model.save();
        }
    }
});

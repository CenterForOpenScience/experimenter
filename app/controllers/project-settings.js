import Ember from 'ember';
import {adminPattern, makeUserPattern} from  '../utils/patterns';

import config from 'ember-get-config';

export default Ember.Controller.extend({
    namespaceConfig: Ember.inject.service(),

    breadCrumb: 'Project configuration',

    osfURL: config.OSF.url,

    adminPattern: adminPattern,
    accountPattern: Ember.computed('namespaceConfig.namespace', function() {
        return `jam-${this.get('namespaceConfig.namespace')}:accounts`;
    }),

    userPatterns: Ember.computed('accountPattern', function() {
        return [adminPattern, this.get('accountPattern')];
    }),

    filteredPermissions: Ember.computed('model', 'userPatterns', function() {
        const permissions = this.get('model.permissions');
        let users = {};
        let system = {};

        let patterns = this.get('userPatterns').map(item => makeUserPattern(item));
        for (let k of Object.keys(permissions)) {
            const dest = patterns.some(item => item.test(k)) ? users : system;
            dest[k] = permissions[k];
        };
        return [users, system];
    }),

    /* Return permissions strings that correspond to admin users (those who log in via OSF) */
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
        changePermissions(permissions, model) {
            // Save updated permissions, and avoid overwriting system-level permissions not displayed to the user
            // Defaults to setting permissions on the namespace; can be overridden if a model is explicitly passed in
            model = model || this.get('model');

            let payload = Object.assign({}, permissions, this.get('systemPermissions'));
            model.set('permissions', payload);
            model.save();
        }
    }
});

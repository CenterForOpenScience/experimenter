import Ember from 'ember';
import {adminPattern} from  '../utils/patterns';

import config from 'ember-get-config';

export default Ember.Controller.extend({

    queryParams: ['collection'],
    collection: '',

    namespaceConfig: Ember.inject.service(),
    namespaceId: Ember.computed.alias('namespaceConfig.namespace'),  // Namespace is apparently a reserved word.

    breadCrumb: 'Project configuration',

    osfURL: config.OSF.url,

    // List of collection names for which we will allow the user to add read-only Jam-authenticated users
    availableCollections: ['accounts'],

    // Define the username format, eg Jam-authenticated users vs OSF provider
    userPattern: Ember.computed('namespaceId', 'collection', function () {
        const collection = this.get('collection');
        if (collection) {
            return `jam-${this.get('namespaceId')}:accounts`;
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

    permissions: Ember.computed.readOnly('model.permissions'),

    actions: {
        changePermissions(permissions) {
            // Save updated permissions, and avoid overwriting system-level permissions not displayed to the user
            let model = this.get('model');
            let payload = Ember.copy(permissions, true);
            model.set('permissions', payload);
            model.save();
        }
    }
});

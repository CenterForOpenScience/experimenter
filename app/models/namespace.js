/*
Manage data about the shared project namespace
 */

import Ember from 'ember';
import DS from 'ember-data';


var osfRegex = /^user-osf-([^*]{5,})$/;  // Pattern for externally validated users authenticated via OSF

export default DS.Model.extend({
    name: DS.attr('string'),
    permissions: DS.attr(),
    createdOn: DS.attr('date'),

    // Filter the permissions list to just the OSF-authenticated users
    osfUsers: Ember.computed('permissions', function() {
        let permissions = this.get('permissions');
        var res = {};
        for (var k in permissions) {
            if (permissions.hasOwnProperty(k)) {
                var match = osfRegex.exec(k);
                if (match) {
                    // Only store OSF id for display purposes, not whole string
                    res[match[1]] = permissions[k];
                }
            }
        }
        return res;
    }),
});

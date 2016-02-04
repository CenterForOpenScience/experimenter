import Ember from 'ember';
var dasherize = Ember.String.dasherize;

export default Ember.Mixin.create({
    // Suppress fields that should not be sent to the server
    attrs: {
        createdOn: {serialize: false},
        createdBy: {serialize: false},
        modifiedOn: {serialize: false},
        modifiedBy: {serialize: false},
    },

    payloadKeyFromModelName: function(modelName) {
        // JamDB expects all collections to specify JSONAPI type 'documents'
        return 'documents';
    },

    extractAttributes: function(modelClass, resourceHash) {
        // Merge meta attributes into the attributes available on model
        var attributes = this._super(...arguments);
        if (resourceHash.meta) {
            modelClass.eachAttribute((key) => {
                let attributeKey = dasherize(key);  // Unlike other payload fields, the ones in meta are dash-case
                if (resourceHash.meta.hasOwnProperty(attributeKey)) {
                    attributes[key] = resourceHash.meta[attributeKey];
                }
            });
        }
        return attributes;
    }
});

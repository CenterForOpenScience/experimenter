import Ember from 'ember';

/*
Convert JamDB responses to and from models
 */
export default Ember.Mixin.create({
    modelName: null,  // Collection items specify a generic type of "documents"; specify model to use explicitly
    relationAttrs: [],  // List of field names (in JSONAPI attributes section) that contain list of relationship IDs

    // Suppress fields that should not be sent to the server
    attrs: { // TODO: This may yield warnings for history entries
        createdOn: {serialize: false},
        createdBy: {serialize: false},
        modifiedOn: {serialize: false},
        modifiedBy: {serialize: false},
    },


    keyForAttribute: function(attr, method) {
        // Override the default ember data behavior, so that Jam can use exactly the same keys as in the model (no dasherizing)
        return attr;
    },

    modelNameFromPayloadKey: function(key) {
        // Replace the generic JamDB response type of 'documents' with the name of the model to deserialize as
        return this.modelName || this._super(key);
    },

    extractRelationships: function(modelClass, resourceHash) {
        var relationships = this._super(...arguments);
        // Some relationships are stored as ID list under attributes; convert to JSONAPI format
        // TODO: May need serialization for return to server?
        function makeRel(idVal, index, array) {
            return {
                id: idVal,
                type: Ember.Inflector.inflector.singularize(relName), // Must match this.modelName
              };
        }

        for (var relName of this.relationAttrs) {
            var relData = resourceHash.attributes[relName];
            var newRel;
            if (relData) {
                // If no value found, assume array if plural, else singular entry. This may be fragile for some words.
                if (Ember.Inflector.inflector.singularize(relName) === relName) {
                    newRel = makeRel(relData);
                } else {
                    newRel = relData.map(relData);
                }

                relationships[relName] = {
                    data: newRel,
                };
            }
        }
        return relationships;
    }
});

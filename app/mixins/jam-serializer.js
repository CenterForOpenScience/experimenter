import Ember from 'ember';

/*
Convert JamDB responses to and from models
 */
export default Ember.Mixin.create({
  modelName: null,
  relationAttrs: [],  // List of field names (in JSONAPI attributes) that denote relationships

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
    for (var relName of this.relationAttrs) {
      var relData = resourceHash.attributes[relName] || [];
      relationships[relName] = {
        data: relData.map(idVal => ({
            id: idVal,
            type: Ember.Inflector.inflector.singularize(relName), // Must match this.modelName
          }))
      };
    }
    return relationships;
  }
});

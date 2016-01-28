import Ember from 'ember';

/*
Convert JamDB responses to and from models
 */
export default Ember.Mixin.create({
  modelName: null,

  keyForAttribute: function(attr, method) {
    // Override the default ember data behavior, so that Jam can use exactly the same keys as in the model (no dasherizing)
    return attr;
  },

  modelNameFromPayloadKey: function(key) {
    // Replace the generic JamDB rsponse type of 'documents' with the name of the model to deserialize as
    return this.modelName || this._super(key);
  },

  payloadKeyFromModelName: function(modelName) {
    // JamDB expects all collections to specify JSONAPI type 'documents'
    return 'documents';
  }
});

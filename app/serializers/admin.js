import Ember from 'ember';
import DS from 'ember-data';

import JamSerializer from '../mixins/jam-serializer';

export default DS.JSONAPISerializer.extend(JamSerializer, {
  modelName: 'admin',

  extractRelationships: function(modelClass, resourceHash) {
    var relationships = this._super(...arguments);
    // Convert list of relationship IDs stored as attributes to JSONAPI format
    var relName = 'experiments';
    var relData = resourceHash.attributes[relName] || [];
    relationships[relName] = {
      data: relData.map(idVal => ({
          id: idVal,
          type: Ember.Inflector.inflector.singularize(relName),
        }))
    };
    return relationships;
  }
});

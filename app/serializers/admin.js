import Ember from 'ember';
import DS from 'ember-data';

import JamSerializer from '../mixins/jam-serializer';
import JamCollectionSerializer from '../mixins/jam-collection-serializer';

export default DS.JSONAPISerializer.extend(JamSerializer, JamCollectionSerializer, {
  modelName: 'admin',
  relationAttrs: ['experiments'],
});

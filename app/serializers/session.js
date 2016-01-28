import DS from 'ember-data';

import JamSerializer from '../mixins/jam-serializer';

export default DS.JSONAPISerializer.extend(JamSerializer, {
  modelName: 'session'
});

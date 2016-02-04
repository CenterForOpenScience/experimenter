import DS from 'ember-data';

import JamSerializer from '../mixins/jam-serializer';
import JamDocumentSerializer from '../mixins/jam-document-serializer';

export default DS.JSONAPISerializer.extend(JamSerializer, JamDocumentSerializer, {
    modelName: 'profile',
    relationAttrs: ['account'],
});

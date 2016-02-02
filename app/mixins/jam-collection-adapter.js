import Ember from 'ember';

export default Ember.Mixin.create({
    findRecordUrlTemplate: '{+host}/{+namespace}/documents{/jamNamespace}.{+collectionId}.{id}',
    findAllUrlTemplate: '{+host}/{+namespace}/collections{/jamNamespace}.{+collectionId}/documents',
    queryUrlTemplate: '{+host}/{+namespace}/collections{/jamNamespace}.{+collectionId}/_search',

    createRecordUrlTemplate: '{+host}/v2/namespaces{/jamNamespace}/collections',
    // TODO: Find delete URL for JAM
    // TODO: Create a page with admin-creation. (just admin collection record, not permissions, to start)

    urlSegments: {
        collectionId: (type, id, snapshot, query) => Ember.Inflector.inflector.pluralize(type),
    }
});

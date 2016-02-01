import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    queryUrlTemplate: '{+host}{/namespace}/documents{/documentId}/history',  // TODO: should be id of form namespace.collection.id
    // TODO Deal with irrelevant (collection-specific) URLs inherited from ApplicationAdapter

    urlSegments: {
        documentId(type, id, snapshot, query) {
          let dId = query.document.id;
          delete query.document;
          return dId;
        }
    }
});

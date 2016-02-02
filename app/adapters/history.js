import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    findRecordUrlTemplate: '{+host}/{+namespace}/documents{/documentId}/history',  // TODO: should be id of form namespace.collection.id,

    urlSegments: {
        documentId(type, id, snapshot, query) {
          let dId = query.document.id;
          delete query.document;
          return dId;
        }
    }
});

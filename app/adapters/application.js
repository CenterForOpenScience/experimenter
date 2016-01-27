import DS from 'ember-data';
import UrlTemplates from 'ember-data-url-templates';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import ENV from 'experimenter/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, UrlTemplates, {
  authorizer: 'authorizer:osf-jwt',

  host: ENV.JAMDB.url,
  namespace: 'v2',

  // All of the models so far are referring to documents in a collection; assume this is global for the application
  //findAllUrlTemplate: '{+host}/v2/collections{/collectionId}/documents',  // TODO: Verify endpoint
  findAllUrlTemplate: '{+host}/v2/collections/experimenter.admins/documents',  // TODO: Hardcode to start until we can fetch dynamically
  queryUrlTemplate: '{+host}/v2/collections{/collectionId}/_search',

  findRecordUrlTemplate: '{+host}/v2/documents/fail_this_request',  // TODO: Document id is of form <NAMESPACE>.<COLLECTION>.<doc_id>

  urlSegments: {
    collectionId(type, id, snapshot, query) {
      let collectionId = query.collection.id;
      delete query.collection;
      return collectionId;
    }
  }
});

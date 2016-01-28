import DS from 'ember-data';

import UrlTemplates from 'ember-data-url-templates';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';


import ENV from 'experimenter/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, UrlTemplates, {
  authorizer: 'authorizer:osf-jwt',

  host: ENV.JAMDB.url,
  namespace: 'v2',

  findAllUrlTemplate: '{+host}/{+namespace}/collections/{+jamNamespace}.{+collectionId}/documents',
  queryUrlTemplate: '{+host}/{namespace}/collections/{+jamNamespace}.{+collectionId}/_search',

  urlSegments: {
    collectionId: () => null,
    jamNamespace: () => ENV.JAMDB.namespace,
  }
});

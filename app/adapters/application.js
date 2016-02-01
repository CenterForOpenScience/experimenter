import Ember from 'ember';
import DS from 'ember-data';

import UrlTemplates from 'ember-data-url-templates';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';


import ENV from 'experimenter/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, UrlTemplates, {
  authorizer: 'authorizer:osf-jwt',

  host: ENV.JAMDB.url,
  namespace: 'v2',

  findRecordUrlTemplate: '{+host}/{+namespace}/documents/{+jamNamespace}.{+collectionId}.{+id}',
  findAllUrlTemplate: '{+host}/{+namespace}/collections/{+jamNamespace}.{+collectionId}/documents',
  queryUrlTemplate: '{+host}/{namespace}/collections/{+jamNamespace}.{+collectionId}/_search',

  urlSegments: {
    collectionId: (type, id, snapshot, query) => Ember.Inflector.inflector.pluralize(type),
    jamNamespace: () => ENV.JAMDB.namespace
  }
});

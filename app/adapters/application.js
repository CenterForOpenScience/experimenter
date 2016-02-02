import Ember from 'ember';
import DS from 'ember-data';

import UrlTemplates from 'ember-data-url-templates';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import ENV from 'experimenter/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, UrlTemplates, {
  authorizer: 'authorizer:osf-jwt',

  host: ENV.JAMDB.url,
  namespace: 'v1/id',

  urlSegments: {
    jamNamespace: () => ENV.JAMDB.namespace
  }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ENV from 'experimenter/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return this.store.find('namespace', ENV.JAMDB.namespace);
    }
});

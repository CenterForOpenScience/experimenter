import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return this.store.findAll('account');  // TODO: Unwrap the list of accounts into a list of profiles
  	}
});

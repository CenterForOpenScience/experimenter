import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    namespaceConfig: Ember.inject.service(),
    model() {
        return this.store.find('namespace', this.get('namespaceConfig').get('namespace'));
    }
});

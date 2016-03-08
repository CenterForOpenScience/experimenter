import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        let experiment = this.modelFor('experiments/info');
        return this.store.findAll(experiment.get('sessionCollectionId'));
    }
});

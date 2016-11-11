import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        let experiment = this.modelFor('experiments/info');
        return this.store.query(experiment.get('sessionCollectionId'),
            {
                'filter[completed]': 1,
                'page[size]':100
            });
    }
});

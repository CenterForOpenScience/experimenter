import Ember from 'ember';
import PaginatedRouteMixin from '../../../../mixins/paginated-route';


export default Ember.Route.extend(PaginatedRouteMixin, {
    model(params) {
        const experiment = this.modelFor('experiments.info');
        return this.queryForPage(experiment.get('sessionCollectionId'), params, {
            'filter[completed]': 1,
        });
    },

    setupController(controller) {
        // Small hack to reuse code
        const sanitizeProfileId = this.controllerFor('experiments.info.results').get('sanitizeProfileId');
        controller.set('sanitizeProfileId', sanitizeProfileId);

        return this._super(...arguments);
    }
});

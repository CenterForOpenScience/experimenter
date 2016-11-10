import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        const experiment = this.modelFor('experiments.info');
        return this.store.query(experiment.get('sessionCollectionId'),
            {
                'filter[completed]': 1,
                'page[size]': 20
            });
    },

    setupController(controller) {
        // Small hack to reuse code
        const sanitizeProfileId = this.controllerFor('experiments.info.results').get('sanitizeProfileId');
        controller.set('sanitizeProfileId', sanitizeProfileId);

        return this._super(...arguments);
    }
});

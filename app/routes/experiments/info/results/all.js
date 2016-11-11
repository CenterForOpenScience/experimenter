import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        //TODO: Get every record EVER, and maybe implement a loading substate template?
        const experiment = this.modelFor('experiments.info');
        return this.store.query(experiment.get('sessionCollectionId'),
            {
                'filter[completed]': 1,
                'page[size]': 100
            });
    },

    setupController(controller) {
        // Small hack to reuse code
        const sanitizeProfileId = this.controllerFor('experiments.info.results').get('sanitizeProfileId');
        controller.set('sanitizeProfileId', sanitizeProfileId);

        return this._super(...arguments);
    }
});

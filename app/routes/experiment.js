import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.find('experiment', params.experiment_id);
    },

    setupController(controller, model) {
        // When experiment loaded, ensure there are corresponding session models
        model._registerSessionModels();
        var collId = model.get('sessionCollectionId');
        var thisQuery = this.store.findAll(collId).then(function() {
            controller.set('someSessions');
        });

        this._super(...arguments)
    }
});

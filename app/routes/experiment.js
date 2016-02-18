import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var self = this;
        return this.store.find('experiment', params.experiment_id).then(function(experiment) {
            // When experiment loaded, ensure there are corresponding session models
            var collId = experiment.get('sessionCollectionId');
            experiment._registerSessionModels(); // TODO: async?

            return Ember.RSVP.hash({
                // The actual return of the model hook: two models, loaded sequentially
                experiment: experiment,
                sessions: self.store.findAll(collId),
            });
        });
    },
});

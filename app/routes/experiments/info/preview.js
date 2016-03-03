import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('experiment', params.experiment_id).then((experiment) => {
            // When page loads, creates new session, but doesn't save to store
            var session = this.store.createRecord(experiment.get('sessionCollectionId'), {
                experimentId: experiment.id,
                profileId: 'tester0.prof1', // TODO fetch from service
                profileVersion: '',
                softwareVersion: ''
            });
            experiment.getCurrentVersion().then(function(versionId) {
                session.set('experimentVersion', versionId);
            });  // TODO: May be an edge case where experimentVersion isn't set/ resolved before this hash returns
            return Ember.RSVP.hash({
                experiment: experiment,
                session: session
            });
        });
    },

    actions: {
        willTransition: function(transition) {
            // FIXME: This won't prevent back button or manual URL change. See https://guides.emberjs.com/v2.3.0/routing/preventing-and-retrying-transitions/#toc_preventing-transitions-via-code-willtransition-code
            if (this.controller.isDirty() && !confirm('Are you sure you want to exit the experiment?')) {
                transition.abort();
                return false;
            } else {
                // Bubble this action to parent routes
                return true;
            }
        }
    }
});

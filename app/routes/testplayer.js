import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        var self = this;
        return this.store.findRecord('experiment', 'experimenter.experiments.test0').then(function(experiment) {
            return Ember.RSVP.hash({
                experiment: experiment,
                blankSession: self.store.createRecord(experiment.get('sessionCollectionId'), {
                    experimentId: experiment.id,  // Prefill values before player...
                }), // Creates new session but doesn't save to store
            });
        });
    },

    actions: {
        willTransition: function(transition) {
            // FIXME: This won't prevent back button or manual URL change. See https://guides.emberjs.com/v2.3.0/routing/preventing-and-retrying-transitions/#toc_preventing-transitions-via-code-willtransition-code
            if (this.controller.isDirty() && !confirm('Are you sure you want to exit the experiment?')) {
                transition.abort();
            } else {
                // Bubble this action to parent routes
                return true;
            }
        }
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ExpPlayerRouteMixin, {
    _getExperiment() {
        return new Ember.RSVP.Promise((resolve) => {
            resolve(this.modelFor('experiments.info'));
        });
    },
    _getSession(params, experiment) {
        var session = this.store.createRecord(experiment.get('sessionCollectionId'), {
            experimentId: experiment.id,
            profileId: 'tester0.prof1', // TODO fetch from service
            profileVersion: '',
            softwareVersion: '',
            expData: {},
            sequence: []
        });
        return new Ember.RSVP.Promise((resolve) => {
            resolve(session);
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

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import PastSessionsRouteMixin from 'exp-player/mixins/past-sessions-route';


export default Ember.Route.extend(AuthenticatedRouteMixin, PastSessionsRouteMixin, {
    model(params) {
        let experiment = this.modelFor('experiments.info');
        let session = this.store.createRecord(experiment.get('sessionCollectionId'), {
            experimentId: experiment.id,
            profileId: 'tester0.prof1', // TODO fetch from service
            profileVersion: '',
            softwareVersion: '',
            expData: {},
            sequence: []
        });

        // TODO: May be an edge case where experimentVersion isn't set/ resolved before this hash returns
        return experiment.getCurrentVersion().then(versionId => {
            session.set('experimentVersion', versionId);
            return session.save().then(() => session);
        });
    },

    setupController: function(controller, model) {
        controller.set('experiment', this.modelFor('experiments.info'));
        return this._super(...arguments);
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

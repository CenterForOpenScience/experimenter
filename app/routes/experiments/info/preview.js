import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';
import WarnOnExitRouteMixin from 'exp-player/mixins/warn-on-exit-route';


export default Ember.Route.extend(AuthenticatedRouteMixin, ExpPlayerRouteMixin, WarnOnExitRouteMixin, {
    currentUser: Ember.inject.service(),
    _getSession: Ember.computed.alias('model'),

    _getExperiment() {
        return Ember.RSVP.resolve(this.modelFor('experiments.info'));
    },

    model(params) {
        let experiment = this.get('_getExperiment');

        return this.get('currentUser').getCurrentUser().then(([account, profile]) => {
            var session = this.store.createRecord(experiment.get('sessionCollectionId'), {
                id: 'PREVIEW_DATA_DISREGARD',
                experimentId: experiment.id,
                profileId: profile.get('id'),
                profileVersion: '', // TODO
                completed: false,
                feedback: '',
                hasReadFeedback: '',
                softwareVersion: '',
                expData: {},
                sequence: []
            });

            return session.reopen({
                save() {
                    // TODO add UI for researcher to see data
                    console.log('Preview Data Save:', this.toJSON());
                    return Ember.RSVP.resolve(this);
                }
            });
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

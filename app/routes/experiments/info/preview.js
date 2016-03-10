import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import WarnOnExitRouteMixin from 'exp-player/mixins/warn-on-exit-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, WarnOnExitRouteMixin, {
    model(params) {
        let experiment = this.modelFor('experiments.info');
        let session = this.store.createRecord(experiment.get('sessionCollectionId'), {
            experimentId: experiment.id,
            profileId: 'tester0.prof1', // TODO fetch from service
            profileVersion: '',
            completed: false,
            feedback: '',
            hasReadFeedback: '',
            softwareVersion: '',
            expData: {},
            sequence: []
        });

        return experiment.getCurrentVersion().then(versionId => {
            session.setProperties({
                id: 'PREVIEW_DATA_DISREGARD',
                experimentVersion: versionId
            });

            return session.reopen({
                save() {
                    console.log('Preview Data Save:', this._internalModel._attributes);
                    return Ember.RSVP.resolve(this);
                }
            })
        });
    },

    setupController: function(controller, model) {
        controller.set('experiment', this.modelFor('experiments.info'));
        return this._super(...arguments);
    }
});

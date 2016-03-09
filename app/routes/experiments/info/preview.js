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
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';
import WarnOnExitRouteMixin from 'exp-player/mixins/warn-on-exit-route';

let {RSVP} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, WarnOnExitRouteMixin, {
    currentUser: Ember.inject.service(),
    _getSession: Ember.computed.alias('model'),

    _getExperiment() {
        return Ember.RSVP.resolve(this.modelFor('experiments.info'));
    },

    model(params) {
        let experiment = this.modelFor('experiments.info');
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

            session.reopen({
                save() {
                    // TODO add UI for researcher to see data
                    console.log('Preview Data Save:', this.toJSON());
                    return Ember.RSVP.resolve(this);
                }
            });

            return RSVP.hash({
                session: session,
                pastSessions: this.get('currentUser').getCurrentUser(([account, profile]) => {
                    return account.pastSessionsFor(experiment, profile);
                })
            })
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model.session);
        controller.set('pastSessions', model.pastSessions);
        controller.set('experiment', this.modelFor('experiments.info'));
    }
});

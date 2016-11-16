import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';
import WarnOnExitRouteMixin from 'exp-player/mixins/warn-on-exit-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, WarnOnExitRouteMixin, ExpPlayerRouteMixin, {
    currentUser: Ember.inject.service(),

    _getExperiment() {
        return new Ember.RSVP.Promise((resolve) => {
            resolve(this.modelFor('experiments.info'));
        });
    },
    _getSession(params, experiment) {
        return this._super(params, experiment).then((session) => {
            var _this = this;

            session.setProperties({
                id: 'PREVIEW_DATA_DISREGARD'
            });

            return session.reopen({
                save() {
                    // TODO add UI for researcher to see data
                    console.log('Preview Data Save:', this.toJSON());
                    if (this.get('completed')) {
                        var controller = Ember.getOwner(this).lookup('controller:experiments.info.preview');
                        controller.showPreviewData(this).then(() => {
                            // Override the WarnOnExitMixin's behavior
                            controller.set('forceExit', true);
                            return _this.transitionTo('experiments.info');
                        });
                        return Ember.RSVP.reject();
                    } else {
                        return Ember.RSVP.resolve(this);
                    }
                }
            });
        });
    }
});

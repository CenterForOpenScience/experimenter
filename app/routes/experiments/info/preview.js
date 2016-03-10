import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';
import WarnOnExitRouteMixin from 'exp-player/mixins/warn-on-exit-route';

let {RSVP} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, WarnOnExitRouteMixin, ExpPlayerRouteMixin, {
    currentUser: Ember.inject.service(),

    _getExperiment() {
        return new Ember.RSVP.Promise((resolve) => {
            resolve(this.modelFor('experiments.info'));
        });
    },
    _getSession(params, experiment) {
        return this._super(params, experiment).then((session) => {
            session.setProperties({
                id: 'PREVIEW_DATA_DISREGARD'
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

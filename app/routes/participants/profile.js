import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('profile', params.profile_id);
    },

    setupController(controller, model) {
        this._super(...arguments);
        this.store.findAll('experiment').then(function(res) {
            // TODO get correct model
            controller.set('profileSessions', res);
        });
    }
});

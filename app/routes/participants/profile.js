import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('profile', params.profile_id);
    },

    afterModel(resolvedModel, transition) {
        // Get all sessions associated with this profile
        this.set('profileSessions', 'placeholder');
    },

    setupController(controller, model){
        this._super(...arguments);
        controller.set('profileSessions', this.get('profileSessions'));
    }
});

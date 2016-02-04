import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('profile', params.profile_id);
    }
});

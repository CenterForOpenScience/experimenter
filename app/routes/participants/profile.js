import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return Ember.RSVP.hash(
            {
                'profile': this.store.findRecord('profile', params.profile_id),
                'sessions': this.store.findAll('session')
            });
    }
});

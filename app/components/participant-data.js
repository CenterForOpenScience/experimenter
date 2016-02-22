import Ember from 'ember';

export default Ember.Component.extend({
    participantSession: '',
    sessionFunction: function(session) {
        return session;
    },
    actions: {
        updateData: function(session) {
            this.set('participantSession', [session]);
        },
    }
});

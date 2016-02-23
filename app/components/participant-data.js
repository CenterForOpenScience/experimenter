import Ember from 'ember';

export default Ember.Component.extend({
    participantSession: '',
    sessionFunction: function(session) {
        return session._internalModel._data;
    },
    actions: {
        updateData: function(session) {
            this.set('participantSession', [session]);
        },
    }
});

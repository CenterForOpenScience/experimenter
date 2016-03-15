import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Responses',
    experiment: null,
    sessions: null,
    sanitizeProfileId: function(session) {
        session.profileId = session.profileId.split('.').slice(-1)[0];
        return session;
    }
});

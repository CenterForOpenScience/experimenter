import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Responses',
    sanitizeProfileId (session) {
        session.profileId = session.profileId.split('.').slice(-1)[0];
        return session;
    }
});

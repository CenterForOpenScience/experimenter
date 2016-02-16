import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return Ember.RSVP.hash(
            {
                'account': this.store.query('account', {filter: {'profiles.profileId': params.profile_id}}),   // TODO: Requires globally unique profile IDs- format <acctShortId>.profileId
                'sessions': this.store.query('session',
                    {filter: {profileId: params.profile_id}}),
            });
    }
});

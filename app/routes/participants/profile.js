import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return Ember.RSVP.hash(
            {
                account: this.store.query('account', {
                    filter: { 'profiles.profileId': params.profile_id }
                }).then(function (items) {
                    // Turn query into a single result
                    return items.toArray()[0];
                }),   // TODO: Finding profile requires globally unique profile IDs- format <acctShortId>.profileId
                sessions: this.store.query('session',  // TODO: Move this page under experiment so that it can query the correct session-bucket for a given experiment
                    { filter: { profileId: params.profile_id } }),
            }).then(function (modelHash) {
            // Extract profile from account and add to hash
            modelHash.profile = modelHash.account.profileById(params.profile_id);
            return modelHash;
        });
    }
});

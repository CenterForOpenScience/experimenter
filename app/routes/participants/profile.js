import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return Ember.RSVP.hash({
          'account': this.store.query('account', {filter: {'profiles.profileId': params.profile_id}}).then(function(items) {
              return items.toArray()[0]; // Turn query into a single result
          }),
          // TODO: Finding profile requires globally unique profile IDs- format <acctShortId>.profileId
          'sessions': this.store.query('session', {filter: {profileId: params.profile_id}}),
        }).then(function(modelHash) {
            // Extract profile from account and add to hash
            modelHash.profile = modelHash.account.profileById(params.profile_id);
            return modelHash;
        });
    }
});

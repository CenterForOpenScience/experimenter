import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        this.set('params', params);
        return Ember.RSVP.hash(
            {
                'account': this.store.query('account', {filter: {'profiles.profileId': params.profile_id}}).then(function(items) {
                    // Turn query into a single result
                    return items.toArray()[0];
                }),   // TODO: Finding profile requires globally unique profile IDs- format <acctShortId>.profileId
                'sessions': this.store.query('session',
                    {filter: {profileId: params.profile_id}}),
            });
    },

    setupController(controller, model) {
        // Save params so we can fetch specific profile data from account
        controller.set('params', this.get('params'));
        this._super(...arguments);
    },
});

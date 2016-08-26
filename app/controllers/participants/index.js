import Ember from 'ember';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [
        {propertyName: 'profileId', title:'ID'}
    ],

    profiles: Ember.computed('model', function() {
        // TODO: How does this handle pagination?
        var accounts = this.get('model');

        var profiles = [];
        accounts.forEach(function(item) {
            profiles = profiles.concat(item.get('profiles')); // Need to use get or field won't be fetched
        });
        return profiles;
    })
});

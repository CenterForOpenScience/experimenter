import Ember from 'ember';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [
        {propertyName: 'experimentId', title:'Experiment ID'}, // TODO: Would prefer experiment name or ID here?
        {propertyName: 'experimentVersion'},
        {propertyName: 'modifiedOn', title: 'Last active'},  // TODO: Is this the correct field to use here?
    ],

    profile: Ember.computed('model', function() {
        var modelHash = this.get('model');
        return modelHash.account.profileById(this.get('params').profile_id);
    })
});

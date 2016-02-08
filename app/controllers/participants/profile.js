import Ember from 'ember';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [
        {propertyName: 'experimentId', title:'Experiment ID'}, // TODO: Would prefer experiment name or ID here?
        {propertyName: 'experimentVersion'},
        {propertyName: 'timestamp', title: 'Last active'},  // TODO: Is this the correct field to use here?
    ],
});

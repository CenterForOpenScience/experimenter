import Ember from 'ember';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [
        {propertyName: 'id', title:'ID'},
        {propertyName: 'firstName'},
        {propertyName: 'lastName'},
        {propertyName: 'modifiedOn', title: 'Last active'},  // TODO: That's not quite what this field does, but useful first approximation
        {title: '', template: 'custom/profile-link'}
    ],
});

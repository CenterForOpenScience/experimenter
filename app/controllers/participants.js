import Ember from 'ember';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [{propertyName: 'id'},
              {propertyName: 'firstName'},
              {propertyName: 'lastName'}],
});

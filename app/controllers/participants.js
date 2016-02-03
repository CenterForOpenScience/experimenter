import Ember from 'ember';
import Account from '../models/account';

export default Ember.Controller.extend({
    // Manually specify column format options for model table
    columns: [{propertyName: 'username'},
              {propertyName: 'password'},
              {propertyName: 'lastName'}]
});

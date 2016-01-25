import DS from 'ember-data';

export default DS.Model.extend({
  // This is specified in the data model, but it may not need to be present in the client side at all. TODO: Check
  profileSchema: DS.attr('string'),
  accountsMin: DS.attr('number'),
  accountsMax: DS.attr('number'),

  accounts: DS.hasMany('account'),
});

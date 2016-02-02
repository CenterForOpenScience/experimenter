/*
Manage data about one or more documents in the accounts collection
 */

import DS from 'ember-data';

export default DS.Model.extend({
  // TODO: Add validators and length limits to fields for UI layer
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  username: DS.attr('string'),
  phone: DS.attr('phone'),
  profile: DS.attr(), // Should match config.profileSchema layout

  history: DS.hasMany('history'),
  permissions: DS.attr(),

  sessions: DS.hasMany('session')
});

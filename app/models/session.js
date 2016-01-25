import DS from 'ember-data';

export default DS.Model.extend({

  softwareVersion: DS.Store('string'),
  parameters: DS.Store(), // TODO: Nested document
  data: DS.Store(),  // TODO: Nested document
  timestamp: DS.Store('date'),

  // JamDB requires two pieces of info to unambiguously identify a record
  profileID: DS.belongsTo('account'),
  //profileVersion: DS.Store('string'),  // TODO: safe to always assume newest profile version?
  experiment: DS.hasMany('experiment'),
  experimentVersion: DS.Store('string'),
});

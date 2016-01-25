import DS from 'ember-data';

export default DS.Model.extend({

  softwareVersion: DS.Store('string'),
  parameters: DS.Store('string'), // TODO: What is the format of parameters? Nested document?
  data: DS.Store('string'),  // TODO: Nested document. May have trouble with field named data?
  timestamp: DS.Store('string'), // TODO: Implement custom date transform for ISO-8601 (check how JamDB serializes)

  // JamDB requires two pieces of info to unambiguously identify a record
  profileID: DS.belongsTo('account'),
  //profileVersion: DS.Store('string'),  // TODO: safe to always assume newest profile version?
  experiment: DS.hasMany('experiment'),
  experimentVersion: DS.Store('string'),
});

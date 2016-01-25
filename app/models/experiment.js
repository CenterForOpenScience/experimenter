import DS from 'ember-data';

export default DS.Model.extend({
  // TODO: Both of these should be embedded objects
  structure: DS.attr('string'),
  schema: DS.attr('string'),

  administrators: DS.hasMany('administrator'),  // TODO: Is Many to many correct relationship type?
  sessions: DS.hasMany('session'),
});

import DS from 'ember-data';

export default DS.Model.extend({
  structure: DS.attr(),  // TODO: Nested document
  schema: DS.attr(),  // TODO: Nested document

  administrators: DS.hasMany('administrator'),  // TODO: Is Many to many correct relationship type?
  sessions: DS.hasMany('session'),
});

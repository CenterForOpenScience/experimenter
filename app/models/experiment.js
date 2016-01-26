import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  structure: DS.attr(),  // TODO: Nested document

  administrators: DS.hasMany('administrator'),  // TODO: Is Many-to-many correct relationship type?
  sessions: DS.hasMany('session'),
});

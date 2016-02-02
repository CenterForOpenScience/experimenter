/*
Manage data about one or more documents in the experiments collection
 */

import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  structure: DS.attr(),  // TODO: Nested document
  permissions: DS.attr(),

  administrators: DS.hasMany('administrator'),  // TODO: Is Many-to-many correct relationship type?
  history: DS.hasMany('history'),
  sessions: DS.hasMany('session'),
});

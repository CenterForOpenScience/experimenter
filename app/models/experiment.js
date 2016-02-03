/*
Manage data about one or more documents in the experiments collection
 */

import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  active: DS.attr('string'),
  beginDate: DS.attr('string'),	// TODO: ISODate
  endDate: DS.attr('string'),	// TODO: ISODate
  lastEdited: DS.attr('string'),	// TODO: ISODate
  structure: DS.attr(),  // TODO: Nested document
  permissions: DS.attr(),

  administrators: DS.hasMany('administrator'),  // TODO: Is Many-to-many correct relationship type?
  history: DS.hasMany('history'),
  sessions: DS.hasMany('session'),
});

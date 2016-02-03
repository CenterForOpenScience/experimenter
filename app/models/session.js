/*
Manage data about one or more documents in the sessions collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {

  softwareVersion: DS.Store('string'),
  parameters: DS.Store(), // TODO: Nested document
  data: DS.Store(),  // TODO: Nested document
  timestamp: DS.Store('date'),

  history: DS.hasMany('history'),
  permissions: DS.attr(),

  // JamDB requires two pieces of info to unambiguously identify a record
  profileID: DS.belongsTo('account'),
  //profileVersion: DS.Store('string'),  // TODO: safe to always assume newest profile version?
  experiment: DS.hasMany('experiment'),
  experimentVersion: DS.Store('string'),
});

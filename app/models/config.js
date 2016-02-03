/*
Manage data about one or more documents in the config collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
  // This is specified in the data model, but it may not need to be present in the client side at all. TODO: Check
  profileSchema: DS.attr(),
  accountsMin: DS.attr('number'),
  accountsMax: DS.attr('number'),
  permissions: DS.attr(),
  history: DS.hasMany('history'),

  administrators: DS.hasMany('administrators'),
});

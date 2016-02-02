/*
Manage the history of a specified document
 */

import DS from 'ember-data';

Ember.Inflector.inflector.uncountable('history');

// Represent document history
export default DS.Model.extend({
  operation: DS.attr('string'),
  parameters: DS.attr(),
  recordId: DS.attr('string'),
});

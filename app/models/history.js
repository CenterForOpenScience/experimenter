import DS from 'ember-data';


// Represent document history
export default DS.Model.extend({
  operation: DS.attr('string'),
  parameters: DS.attr(),
  recordId: DS.attr('string'),
});

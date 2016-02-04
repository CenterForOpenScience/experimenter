import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    shortId: Ember.computed('id', function() {
        // Short IDs are a convenient form used in denoting relationships. This is the part after the last period.
        return this.get('id').split('.').reverse()[0]; // TODO: could be more efficient?
    }),
    // Fields found in meta
    createdOn: DS.attr('date'),
    modifiedOn: DS.attr('date'),
    createdBy: DS.attr('string'),
    modifiedBy: DS.attr('string'),
});

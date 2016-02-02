import DS from 'ember-data';


// Store data about a collection
export default DS.Model.extend({
    name: function() {
      return this.get('id').split('.')[1];
    }.property(),
    permissions: DS.attr(),
    namespace: DS.belongsTo('namespace'),
});

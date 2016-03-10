import Ember from 'ember';

export default Ember.Controller.extend({
    sessions: function() {
        return this.store.query(this.get('model.sessionCollectionId'),
            {'filter[completed]': 1});
    }.property('model'),
    actions: {
        editComponents() {
            this.transitionToRoute('experiments.info.edit', this.get('model'));
        },
        onDelete: function() {
            this.transitionToRoute('experiments');
        },
        onClone: function(exp) {
            this.transitionToRoute('experiments.info', exp.get('id'));
        }
    }
});

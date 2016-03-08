import Ember from 'ember';

export default Ember.Controller.extend({
    sessions: function() {
        return this.store.findAll(this.get('model.sessionCollectionId'));
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

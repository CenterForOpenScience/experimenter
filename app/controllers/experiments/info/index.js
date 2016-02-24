import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: function() {
        return `${this.get('model.experiment.title')}`;
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

import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: function() {
        return `Experiment: ${this.get('model.title')}`;
    }.property('model'),
    actions: {
        onDelete: function() {
            this.transitionToRoute('experiments');
        },
        onResponses: function(exp) {
            this.transitionToRoute('experiment.results', exp);
        },
        onClone: function(exp) {
            this.transitionToRoute('experiment', exp);
        }
    }
});

import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        onResponses: function(exp) {
            this.transitionToRoute('experiment.results', exp);
        },
    }
});

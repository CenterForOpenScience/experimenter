import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        onDelete: function() {
            this.transitionToRoute('experiments');
        },
        onClone: function(exp) {
            this.transitionToRoute('experiment', exp);
        }
    }
});

import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('experiment', 'experimenter.experiments.test0');
    },

    actions: {
        willTransition: function(transition) {
            // FIXME: This won't prevent back button or manual URL change. See https://guides.emberjs.com/v2.3.0/routing/preventing-and-retrying-transitions/#toc_preventing-transitions-via-code-willtransition-code
            // TODO: Make this part of player?
            // TODO: style modal
            // TODO: Be able to check for dirty state first
            if (!confirm('Are you sure you want to exit the experiment?')) {
                transition.abort();
            } else {
                // Bubble this action to parent routes
                return true;
            }
        }
    }
});

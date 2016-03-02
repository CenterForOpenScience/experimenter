import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.store.findRecord('experiment', params.experiment_id);
    },
    willTransition: function(transition) {
        // FIXME: This won't prevent back button or manual URL change. See https://guides.emberjs.com/v2.3.0/routing/preventing-and-retrying-transitions/#toc_preventing-transitions-via-code-willtransition-code
        if (this.controller.isDirty() && !confirm('Are you sure you want to exit the experiment?')) {
            transition.abort();
            return false;
        } else {
            // Bubble this action to parent routes
            return true;
        }
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        var baseParams = this.paramsFor('experiments.info');
        return this.store.findRecord('experiment', baseParams.experiment_id);
    },

    setupController(controller, model) {
        this._super(controller, model);
        var asJSON = JSON.stringify(model, null, 4);
        controller.set('asJSON', asJSON);
    }
});

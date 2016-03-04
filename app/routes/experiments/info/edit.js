import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        var baseModel = this.modelFor('experiments.info'); // The model hook for the parent gets called anyway
        return baseModel.experiment;
    },

    setupController(controller, model) {
        this._super(controller, model);
        var asJSON = JSON.stringify(model, null, 4);
        controller.set('asJSON', asJSON);
    }
});

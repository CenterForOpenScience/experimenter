import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    namespaceConfig: Ember.inject.service(),

    queryParams: {
        collection: {
            refreshModel: true
        }
    },

    model(params) {
        if (params.collection) {
            return this.store.findRecord('collection', params.collection);
        }
        return this.store.findRecord('namespace', this.get('namespaceConfig').get('namespace'));
    },

    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('collection', '');
        }
    }
});

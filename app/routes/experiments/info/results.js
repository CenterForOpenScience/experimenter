import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        let experiment = this.modelFor('experiments/info');
        return this.store.query(experiment.get('sessionCollectionId'),
            {'filter[completed]': 1});
    },

    setupController(controller, model) {
        this._super(...arguments);
        // Create a whitelist controlling how session fields will be serialized
        controller.set('serializeFields',
            [
                {field: 'profileId', transform: (value) => value.split ? value.split('.')[1] : value}, // given acct.profId format, strip off the account ID part
                'sequence',
                'expData',
                'experimentVersion',
                'softwareVersion',
                'createdOn',
                'modifiedOn'
            ]);

    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
    isPresent
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        let params = this.paramsFor('experiments');

        var query = {};
        if (isPresent(params.active)) {
            query['filter[active]'] = params.active;
        }
        // if (isPresent(params.sort)) {
        //     query.sort = params.sort;
        // }
        if (isPresent(params.match)) {
            query.q = params.match;
        }

        if (Object.keys(query).length) {
            return this.store.query('experiment', query);
        }
        else {
            return this.store.findAll('experiment');
        }
    }
});

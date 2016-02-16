import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
    isPresent
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        let params = this.paramsFor('experiments');

        var query = {
            q: []
        };
        if (isPresent(params.active)) {
            query.q.push(`active:${params.active}`);
        }
        if (isPresent(params.sort)) {
            query.sort = params.sort;
        }
        if (isPresent(params.match)) {
            query.q.push(params.match);
        }

        if (query.q.length || query.sort) {
            return this.store.query('experiment', query);
        }
        else {
            return this.store.findAll('experiment');
        }
    }
});

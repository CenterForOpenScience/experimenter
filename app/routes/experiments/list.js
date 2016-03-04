import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
    isPresent
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    queryParams: {
        state: {
            refreshModel: true
        },
        sort: {
            refreshModel: true
        },
        q: {
            refreshModel: true
        },
        match: {
            refreshModel: true
        }
    },
    model(params) {
        var query = {
            q: ['state:(-Deleted)']
        };
        if (isPresent(params.state) && params.state !== 'All') {
            query.q.push(`state:${params.state}`);
        }
        if (isPresent(params.sort)) {
            query.sort = params.sort;
        }
        if (isPresent(params.match)) {
            query.q.push(params.match);
        }

        return this.store.query('experiment', query);
    }
});

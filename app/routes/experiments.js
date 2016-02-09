import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	isPresent
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	queryParams: {
    	active: {
	    	refreshModel: true
	    },
        sortProperties: {
            refreshModel: true
        },
        q: {
            refreshModel: true
        },
        match: {
            refreshModel: true
        },
	},
    model(params) {
        if (isPresent(params.active) && isPresent(params.sortProperties) && isPresent(params.match)) {
            return this.store.query('experiment', {q: params.match, filter: {active: params.active}, sort: params.sortProperties });
        }
        else if (isPresent(params.sortProperties) && isPresent(params.match)) {
            return this.store.query('experiment', {q: params.match, sort: params.sortProperties});
        }
        else if (isPresent(params.match)) {
            return this.store.query('experiment', {q: params.match});
        }
    	return this.store.findAll('experiment');
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	queryParams: {
    	active: {
	    	refreshModel: true
	    }
	},
    beforeModel() {

    },
    model(params) {
    	return this.store.query('experiment', {filter: params});
    	// return this.store.query('experiment', {filter: {active: 'Active'}});
    	// return this.store.query('experiment', {filter: {title: 'Abomination of Gudul'}});
    	// return this.store.findAll('experiment');
    }
});

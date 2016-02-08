import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	isPresent
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	queryParams: {
    	active: {
	    	refreshModel: true
	    }
	},
    model(params) {
    	if (isPresent(params.active)) {
    		return this.store.query('experiment', {filter: params});
    	}
    	return this.store.findAll('experiment');
    	
    	// return this.store.query('experiment', {filter: {title: 'Abomination of Gudul'}});
    }
});

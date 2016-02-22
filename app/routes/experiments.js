import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

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
	}
});

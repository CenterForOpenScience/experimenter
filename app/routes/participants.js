import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
    	return [
    		{
    			'firstName': 'Sally',
    			'lastName': 'Jane',
    			'username': 'jSally',
    			'kids': [],
    			'experiments': [],
	    	}, {
	    		'firstName': 'Bob',
	    		'lastName': 'Builder',
	    		'username': 'bBuilder',
    			'kids': [],
    			'experiments': [],
	    	}, {
	    		'firstName': 'Julius',
	    		'lastName': 'Salad',
	    		'username': 'jSalad',
    			'kids': [],
    			'experiments': [],
	    	}
	    ];
  	}
});

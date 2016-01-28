import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
    	return [
    		{
			    'firstName': 'Sam',
			    'username': 'sam@cos.io',
			    'experiments': ['test'],
			    'lastName': 'Chrisinger',
			    'password': '$2b$12$iujjM4DtPMWVL1B2roWjBeHzjzxaNEP8HbXxdZwRha/j5Pc8E1n2G'
			},
		];
	}
});

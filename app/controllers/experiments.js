import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['active'],
	active: null,

	actions: {
	    selectStatusFilter: function(status) {
	      	this.set('active', status);
	    },
	}
});

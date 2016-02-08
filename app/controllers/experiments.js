import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['active'],
	active: null,
	sortProperty: 'title',
	sortOrder: 'asc',
	sortProperties: Ember.computed('sortProperty', 'sortOrder', function() {
		return [`${this.get('sortProperty')}:${this.get('sortOrder')}`];
	}),
	sortedExperiments: Ember.computed.sort('model', 'sortProperties'),
	toggleOrder: function(order) {
		if (order === 'asc') {
    		this.set('sortOrder', 'desc'); 
    	} else {
    		this.set('sortOrder', 'asc');
    	}
	},
	actions: {
	    selectStatusFilter: function(status) {
	      	this.set('active', status);
	    },
	    sortingMethod: function(sortProperty) {
	    	if (this.get('sortProperty') === sortProperty) {
	    		this.toggleOrder(this.get('sortOrder'));
	    	} else {
	    		this.set('sortOrder', 'asc');
	    	}
	      	this.set('sortProperty', sortProperty);
	      	this.get('sortedExperiments');
	    },
	}
});

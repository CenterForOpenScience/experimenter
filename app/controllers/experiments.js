import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['active', 'sortProperties', 'match'],
	active: null,
	order: 'asc',
	match: '*',

	sortProperty: 'title',
	sortOrder: 'asc',
	sortProperties: Ember.computed('sortProperty', 'sortOrder', function() {
		if (this.get('sortProperty') == null) {
			return null
		}
		return [`${this.get('sortProperty')}:${this.get('sortOrder')}`];
	}),
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
	      	this.set('sortProperty', 'title');
	      	this.set('sortOrder', 'asc');
	    },
	    sortingMethod: function(sortProperty) {
	    	if (this.get('sortProperty') === sortProperty) {
	    		this.toggleOrder(this.get('sortOrder'));
	    	} else {
	    		this.set('sortOrder', 'asc');
	    	}
	      	this.set('sortProperty', sortProperty);
	    },
	    resetParams: function() {
	    	this.set('active', null);
	      	this.set('match', '*');
	      	this.set('sortProperty', 'title');
	      	this.set('order', 'asc');
	    },
	    updateSearch: function(value) {
	    	this.set('match', value);
	    	this.set('sortProperty', null);
	    },
	}
});

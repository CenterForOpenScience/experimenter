import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['active'],
	active: null,

	filteredExperiments: Ember.computed('active', 'model', function() {
		var active = this.get('active');
		var experiments = this.get('model');

		if (active) {
		  	return experiments.filterBy('active', active);
		} else {
		  	return experiments;
		}
	}),

	actions: {
	    selectStatusFilter: function(status) {
	      this.set('active', status);
	    },
	}
});

import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['active'],
	active: null,
	sortingMethod: null,

	sortedExperiments: Ember.computed('sortingMethod', 'model', function() {
		var sortingMethod = this.get('sortingMethod');
		var experiments = this.get('model');

		if (sortingMethod) {
			return experiments.sortBy('experiments', sortingMethod);
		}
		return experiments
	}),
	// using standard ascending sort
	// experimentTitleSorting: ['title'],
	// sortedExperimentsTitle: Ember.computed.sort('experiments', 'experimentTitleSorting'),

	// using descending sort
	// experimentTitleSortingDesc: ['title:desc'],
	// sortedExperimentsTitleDesc: Ember.computed.sort('experiments', 'experimentTitleSortingDesc'),

	actions: {
	    selectStatusFilter: function(status) {
	      	this.set('active', status);
	    },
	    selectSortingMethod: function(sortingMethod) {
	      	this.set('sortingMethod', sortingMethod);
	      	this.get('sortedExperiments');
	    },
	}
});

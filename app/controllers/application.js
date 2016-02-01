import Ember from 'ember';

export default Ember.Controller.extend({
	isExpanded: true,
	isNotLogin: Ember.computed('this.currentPath', function() {
	  	if (this.currentPath !== "login") {
	  		return true
	  	} else {
	  		return false
	  	}
	}),

	actions: {
	    toggleMenu: function() {
	      this.toggleProperty('isExpanded');
	    },
	}
});

import Ember from 'ember';

export default Ember.Controller.extend({
	isExpanded: true,

	actions: {
	    toggleMenu: function() {
	      this.toggleProperty('isExpanded');
	    },
	}
});

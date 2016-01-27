import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
    	return [
    		{
			    "id": "Experiment1",
			    "title": "A Test Experiment1",
			    "description": "This is just for testing.",
			    "structure": []           
			}, {
			    "id": "Experiment2",
			    "title": "A Test Experiment2",
			    "description": "This is just for testing.",
			    "structure": []           
			}, {
			    "id": "Experiment3",
			    "title": "A Test Experiment3",
			    "description": "This is just for testing.",
			    "structure": []           
			}, {
			    "id": "Experiment4",
			    "title": "A Test Experiment4",
			    "description": "This is just for testing.",
			    "structure": []           
			}, {
			    "id": "Experiment5",
			    "title": "A Test Experiment5",
			    "description": "This is just for testing.",
			    "structure": []           
			}, {
			    "id": "Experiment6",
			    "title": "A Test Experiment6",
			    "description": "This is just for testing.",
			    "structure": []           
			}, 
		];
	}
});

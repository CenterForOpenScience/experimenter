import Ember from 'ember';

const {
	isPresent
} = Ember;

export function routeMatches([ currentRouteName, target ] /*, hash*/) {
	let result = currentRouteName.match(new RegExp(`^${target}`));
	return isPresent(result);
}

export default Ember.Helper.helper(routeMatches);

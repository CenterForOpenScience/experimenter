import Ember from 'ember';

export function routeMatches([currentRouteName, target] /*, hash*/) {
    let result = currentRouteName.match(new RegExp(`^${target}`));
    return Ember.isPresent(result);
}

export default Ember.Helper.helper(routeMatches);

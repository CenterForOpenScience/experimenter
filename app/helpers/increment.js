import Ember from 'ember';

export function routeMatches([ val, inc ] /*, hash*/) {
  return parseInt(val) + parseInt(inc);
}

export default Ember.Helper.helper(routeMatches);

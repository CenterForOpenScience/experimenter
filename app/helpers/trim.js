import Ember from 'ember';

export function trim(params /*, hash*/ ) {
    return (params[0] || '').toString().trim();
}

export default Ember.Helper.helper(trim);

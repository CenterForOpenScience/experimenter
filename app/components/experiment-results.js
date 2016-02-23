import Ember from 'ember';

export default Ember.Component.extend({
    allSessionFunction: function(session) {
        return session._internalModel._data;
    },
});

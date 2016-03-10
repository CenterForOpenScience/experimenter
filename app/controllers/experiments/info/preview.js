import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Preview',
    experiment: null,
    session: null,
    isDirty: function() {
        return this.get('model.hasDirtyAttributes');
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            var session = this.get('session');
            session.setProperties(payload);
            session.completed = true;  // TODO: Assumption: saveSession only called once, when saving data at end of session
            session.save();
        }
    }
});

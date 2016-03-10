import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Preview',
    experiment: null,
    isDirty: function() {
        return this.get('model.hasDirtyAttributes');
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            var model = this.get('model');
            model.setProperties(payload);
            model.completed = true;  // TODO: Assumption: saveSession only called once, when saving data at end of session
            model.save();
        }
    }
});

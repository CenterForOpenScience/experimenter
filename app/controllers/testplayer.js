import Ember from 'ember';

export default Ember.Controller.extend({
    isDirty() {
        // TODO: check the session model to see if it contains unsaved data
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            console.log('controller is attempting to save');
            var model = this.get('model.blankSession');
            model.setProperties(payload);
            model.save();  // TODO: Do we need to set model with changed result?
        }
    }
});

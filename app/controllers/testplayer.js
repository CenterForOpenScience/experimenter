import Ember from 'ember';

export default Ember.Controller.extend({
    isDirty: function() {
        // TODO: check the session model to see if it contains unsaved data
        var model = this.get('model.blankSession');
        return model.get('hasDirtyAttributes');
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            console.log('controller is attempting to save');
            var model = this.get('model.blankSession');
            model.setProperties(payload);
            model.save();
            // this.set('model', model);  //  TODO: Update model on controller
        }
    }
});

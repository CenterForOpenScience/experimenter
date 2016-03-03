import Ember from 'ember';

export default Ember.Controller.extend({
    isDirty: function() {
        var session = this.get('model.session');
        return session.get('hasDirtyAttributes');
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            var session = this.get('model.session');
            session.setProperties(payload);
            session.save();
            this.set('model.session', session);
        }
    }
});

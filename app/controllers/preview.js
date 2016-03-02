import Ember from 'ember';

export default Ember.Controller.extend({
    model: null,
    store: Ember.inject.service(),
    isDirty: function() {
        // TODO: check the session model to see if it contains unsaved data
        var session = this.get('session');
        return session.get('hasDirtyAttributes');
    },
    actions: {
        saveSession(payload) {
            // Save a provided javascript object to a session object
            var session = this.get('session');
            session.setProperties(payload);
            session.save();
            this.set('session', session);
        }
    },
    _session: null,
    session: Ember.computed('model', {
        get: function() {
            var session = this.get('store').createRecord(this.get('model.sessionCollectionId'), {
                experimentId: this.get('experiment.id'),
                profileId: 'tester0.prof1', // TODO fetch from service
                profileVersion: '',
                softwareVersion: ''
            });
            this.get('model').getCurrentVersion().then(function(versionId) {
                session.set('experimentVersion', versionId);
            });
            this.set('session', session);
            return session;
        },
        set: function(_, session) {
            this.set('_session', session);
            return session;
        }
    })
});

import Ember from 'ember';
import ENV from 'experimenter/config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    actions: {
        authenticate() {
            window.location = `${ENV.OSF.url}/oauth2/authorize?response_type=token&scope=${ENV.OSF.scope}&client_id=${ENV.OSF.clientId}&redirect_uri=${encodeURI(window.location)}`;
        }
    }
});

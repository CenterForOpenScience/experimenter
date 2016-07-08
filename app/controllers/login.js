import Ember from 'ember';
import ENV from 'experimenter/config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    namespaceConfig: Ember.inject.service(),
    selectedNamespace: null,
    actions: {
        authenticate() {
            this.transitionToRoute('login').then(() => {
                window.location = `${ENV.OSF.authUrl}/oauth2/authorize?response_type=token&scope=${ENV.OSF.scope}&client_id=${ENV.OSF.clientId}&redirect_uri=${encodeURI(window.location)}`;
            });
        },
        selectNamespace() {
            var ns = this.get('selectedNamespace');
            this.get('namespaceConfig').set('namespace', ns);
            this.transitionToRoute('experiments');
        }
    }
});

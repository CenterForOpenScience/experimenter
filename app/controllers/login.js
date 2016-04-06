import Ember from 'ember';
import ENV from 'experimenter/config/environment';

const ACCESS_DENIED = 'access_denied';
const NO_PERMISSIONS = 'no_permissions';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    queryParams: ['error'],
    error: null,
    errorMessage: Ember.computed('error', function() {
        var error = this.get('error');
        if (!error) {
            return null;
        }

        if (error === ACCESS_DENIED) {
            return 'You must choose \'Allow\' to be granted access to this site.';
        }
        else if (error === NO_PERMISSIONS) {
            return 'User does not have permissions on the domain.';
        }
        else {
            return 'Error logging in. Please try again.';
        }
    }),

    actions: {
        authenticate() {
            this.set('error', null);
            this.transitionToRoute('login').then(() => {
                window.location = `${ENV.OSF.authUrl}/oauth2/authorize?response_type=token&scope=${ENV.OSF.scope}&client_id=${ENV.OSF.clientId}&redirect_uri=${encodeURI(window.location)}`;
            });
        }
    }
});

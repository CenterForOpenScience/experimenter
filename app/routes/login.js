import Em from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Em.Route.extend(UnauthenticatedRouteMixin, {
    beforeModel() {
        // Acquire an OSF access token, then exchange it for a Jam token
        this._super(...arguments);
        var hash = window.location.hash.substring(1).split('&').map(function(str) {
            return this[str.split('=')[0]] = str.split('=')[1], this;
        }.bind({}))[0];
        window.location.hash = '';
        if (!hash.access_token) {
            return null;
        }
        return this.get('session').authenticate('authenticator:jam-osf-jwt', hash.access_token, hash.expires_in)
            .then(() => this.transitionTo('experiments'))
            .catch((/*reason*/) => {
                // TODO: Pick failure reason off the response for custom messages
                this.set('errorMessage', 'User does not have permissions on the domain');
            });
    },

    setupController(controller) {
        this._super(...arguments);
        controller.set('errorMessage', this.get('errorMessage'));
    }
});

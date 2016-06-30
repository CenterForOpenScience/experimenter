import Em from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Em.Route.extend(AuthenticatedRouteMixin, {
    beforeModel() {
	this.transitionTo('experiments');
    }
});

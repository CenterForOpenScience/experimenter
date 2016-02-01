import Em from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Em.Route.extend(AuthenticatedRouteMixin, {
    model () {
        var auth = this.get('session.data.authenticated');
        return this.store.find('admin', 'foo'); // auth.id);
    },
    actions: {
        error (err, transition) {
            if (err.errors[0].status === '404') {
                return this.transitionTo('errors.no-account');
            }
            else {
                return true;
            }
        }
    }
});

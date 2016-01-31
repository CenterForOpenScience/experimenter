import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    beforeModel() {
        
    },
    model() {
        var ret = new Ember.RSVP.Promise(function(){}, function(){});
        window.setTimeout(ret.resolve, 5000);
        return Ember.RSVP.hash({
            experiments: this.store.findAll('experiment')
        });
    }
});

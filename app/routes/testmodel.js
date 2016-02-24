import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return Ember.RSVP.hash({
            experiments: this.store.findAll('experiment'),
            accounts: this.store.findAll('account')
        });
    },
    afterModel(model) {
        var experiments = model.experiments.filter((e) => Ember.isPresent(e.get('eligibilityCriteria')));
        var accounts = model.accounts.filter(() => true);

        var exp = experiments[0];
        var acc = accounts[0];
        var profile = acc.get('profiles')[0];
        console.log(profile.get('age'));
        console.log(exp.isEligible(profile));
    }
});

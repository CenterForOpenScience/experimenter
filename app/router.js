import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('login');
    this.route('experiments', function() {
        this.route(':experiment_id', function() {
            this.route('edit');
            this.route('results');
        });
    });
    this.route('participants');
    this.route('settings');
    this.route('testmodel');
});

export default Router;

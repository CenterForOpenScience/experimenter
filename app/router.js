import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', {path: '/'});

    this.route('login');

    // A post-login route that checks the current OSF user's auth
    // against the jam API
    this.route('check');
    this.route('errors', function() {
        this.route('no-account');
    });

    this.route('experiments', function() {
        this.route(':experiment_id', function() {
            this.route('edit');
            this.route('results');
        });
    });
    this.route('participants');
    this.route('settings');
    this.route('project-settings');
});

export default Router;

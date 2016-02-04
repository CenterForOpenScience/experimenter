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
        this.route('detail', {path: '/:experiment_id/'});
        this.route('edit', {path: '/:experiment_id/edit/'});
        this.route('results', {path: '/:experiment_id/results/'});
    });

    this.route('participants', function() {
      this.route('profile', {path: ':profile_id/'});
    });
    this.route('settings');
    this.route('project-settings');
});

export default Router;

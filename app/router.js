import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', {
        path: '/'
    });

    this.route('login');

    this.route('errors', function() {
        this.route('generic');
    });

    this.route('experiments', function() {
        this.route('list', {path: '/'});
    });

    this.route('experiment', {
        path: '/experiments/:experiment_id/'
    }, function() {
        this.route('edit', {
            path: '/edit/'
        });
        this.route('results', {
            path: '/results/'
        });
    });

    this.route('participants', function() {
        this.route('profile', {
            path: ':profile_id/'
        });
    });
    this.route('settings');
    this.route('project-settings');

    this.route('testmodel');
});

export default Router;

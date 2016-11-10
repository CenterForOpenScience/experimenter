import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route('index', {
        path: '/'
    });

    this.route('login');

    this.route('errors', function () {
        this.route('generic');
    });

    this.route('experiments', function () {
        this.route('list', {
            path: '/'
        });
        this.route('info', {
            path: '/:experiment_id'
        }, function () {
            this.route('edit');
            this.route('results', function() {
              this.route('all');
            });
            this.route('preview');
        });
    });

    this.route('participants', function () {
        this.route('profile', {
            path: ':profile_id/'
        });
    });

    this.route('project-settings', {
        path: '/settings'
    });
});

export default Router;

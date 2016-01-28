import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('login');
    this.route('dashboard');
    this.route('participants');
    this.route('experiment', {
        path: '/:experiment_id'
    });
    this.route('settings');
    this.route('creator');
    this.route('testmodel');
});

export default Router;

import Em from 'ember';
import ENV from 'experimenter/config/environment';

export default Em.Route.extend({
  toast: Em.inject.service(),

  actions: {
    error (err) {
        if (ENV.environment !== 'development') {
            this.get('toast').error(err.message, err.name);
            this.transitionTo('errors.generic');
            return false;
        } else {
            return true;
        }
    }
  }
});

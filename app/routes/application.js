import Em from 'ember';
import ENV from 'experimenter/config/environment';

export default Em.Route.extend({
  toast: Em.inject.service(),

  actions: {
    error (err, transition) {
        if (ENV.environment !== 'development') {
            this.get('toast').error(err.message, err.name);
        } else {
            console.error(err);
            this.get('toast').error(err.stack, err, {
            timeOut: 0,
            closeButton: true,
            });
        }

        this.transitionTo('errors.generic');
    }
  }
});

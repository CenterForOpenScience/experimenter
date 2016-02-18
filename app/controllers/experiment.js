import Ember from 'ember';

export default Ember.Controller.extend({
  breadCrumb: function() {
      return `Experiment: ${this.get('model.title')}`;
  }.property('model'),
});

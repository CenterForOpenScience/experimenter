import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    editComponents() {
      this.transitionToRoute('experiments.info.edit', this.get('model'));
    }
  }
});

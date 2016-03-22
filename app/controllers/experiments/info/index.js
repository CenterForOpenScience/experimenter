import Ember from 'ember';

export default Ember.Controller.extend({
    sessions: function() {
        return this.store.query(this.get('model.sessionCollectionId'),
            {'filter[completed]': 1});
    }.property('model'),
    actions: {
        editComponents() {
            this.transitionToRoute('experiments.info.edit', this.get('model'));
        },
        onDelete: function() {
            // A hack: ES may take up to a second to refresh its contents. Give it
            // a fair head start.
            window.setTimeout(() => {
                this.transitionToRoute('experiments.list');
            }, 500);
        },
        onClone: function(exp) {
            this.transitionToRoute('experiments.info', exp.get('id'));
        }
    }
});

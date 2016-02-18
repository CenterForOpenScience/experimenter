import Ember from 'ember';

export default Ember.Component.extend({
    experiment: null,
    editing: false,
    toast: Em.inject.service(),
    actions: {
        toggleEditing: function() {
            this.toggleProperty('editing');
            if (!this.get('editing')) {
                var exp = this.get('experiment');
                exp.save().then(() => {
                    this.get('toast.info')('Experiment saved successfully.');
                });
            }
        },
        responses: function() {
            var exp = this.get('experiment');
            this.get('onResponses')(exp);
        }
    }
});

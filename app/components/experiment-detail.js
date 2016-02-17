import Ember from 'ember';

export default Ember.Component.extend({
    experiment: null,
    editing: false,
    toast: Ember.inject.service(),
    actions: {
        toggleEditing: function() {
            this.toggleProperty('editing');
            if (!this.get('editing')) {
                this.get('experiment').save().then(() => {
                    this.get('toast.info')('Experiment saved successfully.');
                });
            }
        },
        stop: function() {
            var exp = this.get('experiment');
            exp.set('state', exp.ARCHIVED);
            exp.save().then(() => {
                this.get('toast.info')('Experiment stopped successfully.');
            });
        },
        start: function() {
            var exp = this.get('experiment');
            exp.set('state', exp.ACTIVE);
            exp.save().then(() => {
                this.get('toast.info')('Experiment started successfully.');
            });
        },
        delete: function() {
            this.get('onDelete')(this.get('experiment'));
        },
        clone: function() {

        }
    }
});

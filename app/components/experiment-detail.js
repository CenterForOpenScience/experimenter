import Ember from 'ember';

export default Ember.Component.extend({
    experiment: null,
    editing: false,
    actions: {
        toggleEditing: function() {
            this.toggleProperty('editing');
            if (!this.get('editing')) {
                var exp = this.get('experiment');
                exp.save().then(function() {
                    debugger;
                });
            }
        }
    }
});

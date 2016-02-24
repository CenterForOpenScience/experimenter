import Ember from 'ember';

export default Ember.Component.extend({
    isEditing: false,
    actions: {
        edit() {
            this.set('isEditing', true);
        },
        stopEditing() {
            this.set('isEditing', false);
        }
    }
});

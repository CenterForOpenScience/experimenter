import Ember from 'ember';

export default Ember.Component.extend({
    buttons: null,
    activeButton: null,
    onSelect: null,
    actions: {
        onSelect: function(button) {
            this.get('onSelect')(button);
        }
    }
});

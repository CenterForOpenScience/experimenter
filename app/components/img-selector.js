import Ember from 'ember';

export default Ember.Component.extend({
    thumbnail: null,
    edit: true,
    actions: {
        uploadImage: function(e) {
            var self = this;

            var reader = new window.FileReader();
            reader.onload = function(event){
                self.set('thumbnail', event.target.result);
                var onSetImage = self.get('onSetImage');
                if (onSetImage) {
                    onSetImage(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        },
        clickInput: function() {
            this.$().find('.img-selector-input').click();
        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    thumbnail: null,
    edit: true,
    actions: {
        uploadImage(e) {
            var _this = this;

            var reader = new window.FileReader();
            reader.onload = function (event) {
                _this.set('thumbnail', event.target.result);
                var onSetImage = _this.get('onSetImage');
                if (onSetImage) {
                    onSetImage(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        },
        clickInput: function () {
            this.$().find('.img-selector-input').click();
        }
    }
});

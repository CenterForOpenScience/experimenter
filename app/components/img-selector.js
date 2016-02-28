import Ember from 'ember';

export default Ember.Component.extend({
    thumbnail: null,
    actions: {
        uploadImage: function(e) {
            var self = this;

            //var canvas = this.$().find('.img-selector-canvas')[0];
            //var ctx = canvas.getContext('2d');

            var reader = new window.FileReader();
            reader.onload = function(event){
                /*
                var img = new Image();
                img.onload = function(){
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0);
                };
                img.src = event.target.result;
                 */
                self.set('thumbnail', event.target.result);
                var onSetImage = self.get('onSetImage');
                if (onSetImage) {
                    onSetImage(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
});

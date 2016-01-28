// app/components/exp-frame-base.js
import Ember from 'ember';

function NotImplemnetedError(message) {
   this.message = message;
   this.name = 'NotImplementedError';
}

export default Ember.Component.extend({
    /** An abstract component for defining experimenter frames
     **/
    id: null,
    willRender() {
        this._super(...arguments);

        var params = this.get('params') || {};
        var paramKeys = Object.keys(params);
        for (var i = 0; i < paramKeys.length; i++) {
            var key = paramKeys[i];
            this.set(key, params[key]);
        }

        var id = this.get('id');
        if (!id) {
            throw new NotImplemnetedError('ExpFrameBase subclasses must specify an id');
        }
        // deepcopy global context
        this.set('ctx', Ember.copy(this.get('ctx')));
    },
    actions: {
        next() {
            this.get('next')();
        },
        last() {
            this.get('last')();
        },
        previous() {
            this.get('previous')();
        }
    }
});

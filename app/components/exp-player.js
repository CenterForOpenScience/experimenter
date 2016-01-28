import Ember from 'ember';

let NO_FRAMES = [
    {
        id: 'NO_FRAMES',
        type: 'info',
        title: 'No frames specified',
        body: 'You\'ll needs to specifiy some frames for this experiment. See our getting started page: ...'
    }
];

let NOT_FOUND = 'exp-not-found';


export default Ember.Component.extend({
    frames: NO_FRAMES,
    frameIndex: null,
    _last: null,
    ctx: {
        data: {}
    },
    _registry: Ember.inject.service('exp-frame-registry'),
    onInit: function() {
        this.set('frameIndex', 0);
    }.on('init'),
    currentFrame: Ember.computed('frames', 'frameIndex', function() {
        var frames = this.get('frames');
        var frameIndex = this.get('frameIndex');
        return frames[frameIndex];
    }),
    currentFrameType: Ember.computed('currentFrame', function() {
        var currentFrame = this.get('currentFrame');
        return !!currentFrame ? currentFrame.type : '';
    }),
    currentFrameTemplate: Ember.computed(function() {
        var currentFrame = this.get('currentFrame');
        var componentName = `exp-${currentFrame.type}`;

        if (!this.container.lookup(`component:${componentName}`)) {
            console.warn(`No component named ${componentName} is registered.`);
            return NOT_FOUND;
        }
        return componentName;
    }),
    currentFrameId: Ember.computed('currentFrame', function() {
        var currentFrame = this.get('currentFrame');
        return currentFrame.id;
    }),
    currentFrameData: Ember.computed('currentFrame', function() {
        var currentFrame = this.get('currentFrame');
        var context = this.get('ctx');
        
        if (!context[currentFrame.id]) {
            context[currentFrame.id] = null;
        }       
        return context[currentFrame.id];
    }),
    actions: {
        next() {
            console.log('next');
        },
        previous() {
            console.log('previous');
        },
        last() {
            console.log('last');
        },
        skipTo(index) {
            this.set('frameIndex', index);
        }
    }
});

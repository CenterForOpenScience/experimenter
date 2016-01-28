import Ember from 'ember';

export default Ember.Service.extend({
    registeredFrames: null,
    init () {
        this._super(...arguments);
        this.set('registeredFrames', []);
    },
    register (id) {
        var registeredFrames = this.get('registeredFrames');
        if (this.isRegistered(id)) {
            console.warn(`Called register with an already registered id: ${id}. Overwriting...`);
        }
        this.get('registeredFrames').pushObject(id);
    },
    unregister (id) {
        this.get('registeredFrames').removeObject(id);
    },
    isRegistered (id) {
        var registeredFrames = this.get('registeredFrames');
        return !!registeredFrames.find((item) => {
            return item === id;
        });
    }
});

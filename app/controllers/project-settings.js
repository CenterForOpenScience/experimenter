import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        permissionsUpdated(permissions) {
            this.set('model.permissions', permissions);
            this.get('model').save();
        }
    }
});

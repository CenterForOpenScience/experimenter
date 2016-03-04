import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Edit',
    toast: Ember.inject.service('toast'),


    actions: {
        save(data) {
            var model = this.get('model');
            var payload;
            try {
                payload = JSON.parse(data);
            } catch(e)  {
                console.log(e);
                this.toast.error('Could not save experiment. Check definition for syntax errors.'); // TODO: Improve error UX
                return false;
            }

            model.setProperties(payload);  // FIXME: Does not unset properties that were removed, eg patch request
            model.save().then(() => { // resolve
                this.set('model');
                this.send('toList');
            }, () => { // reject
                this.toast.error('The server refused to save the data, likely due to a schema error');
            });
        },

        toList() {
            this.transitionToRoute('experiments.list');
        }
    }
});

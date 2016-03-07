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

            model.setProperties(payload);  // Sets all keys in payload, including those not part of model definition
            // If a key was removed from the JSON, it won't be (re)set above; enforce that absent keys are set to undefined
            //    (so that the database value for that field is actually changed)
            model.eachAttribute((key) => {
                if (!payload.hasOwnProperty(key)) {
                    model.set(key, undefined);
                }
            });

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

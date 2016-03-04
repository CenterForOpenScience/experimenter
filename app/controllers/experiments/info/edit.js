import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Edit',
    toast: Ember.inject.service('toast'),


  aceInit: function(editor) {
    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.getSession().setTabSize(4);
    editor.getSession().setMode('ace/mode/javascript');
  },


    actions: {
        save(data) {
            // TODO: Save model and call transition to list page
            var model = this.get('model');
            var payload;
            try {
                payload = JSON.parse(data);
            } catch(e)  {
                console.log(e);
                this.toast.error('Could not save experiment. Check definition for syntax errors.');
                return false;
            }

            model.setProperties(payload);  // FIXME: Does not unset properties that were removed
            model.save().then(() => { // resolve
                this.set('model'); // TODO: update JSON variable? needed?
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

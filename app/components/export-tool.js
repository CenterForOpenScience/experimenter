import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    data: null,
    processData: function(data) {
        console.log(data);
        this.set('data', data.content);
    },
    actions: {
        loadData: function() {
            var store = this.get('store');
            var self = this;
            var data = store.findAll('profile').then( function(results) {
                console.log(results);
                self.processData(results);
            })
        }
    }
});

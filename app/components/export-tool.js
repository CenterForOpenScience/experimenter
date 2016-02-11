import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    data: null,
    processData: function(data) {
        console.log(data);
        var dataArray = data.content;
        var jsonData = "";
        for (var i = 0; i < dataArray.length; i++) {
            jsonData = jsonData + JSON.stringify(dataArray[i]._data);
        }
        this.set('data', jsonData);
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

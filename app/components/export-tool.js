import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    processedData: Ember.computed( 'data', 'mappingFunction', {
        get() {
            var dataArray = this.get('data');
            var mappingFunction = this.get('mappingFunction');
            if (Ember.isPresent(dataArray) && Ember.isPresent(mappingFunction)) {
                console.log(mappingFunction);
                return this.convertToJSON(dataArray); 
            } else if (Ember.isPresent(dataArray)) {
                return this.convertToJSON(dataArray); 
            } else {
                return null;
            }
        }, 
        set(_, value) {
            this.set('processedData', value);
        }
    }),
    convertToJSON: function (dataArray) {
        console.log(dataArray);
        var jsonData = "";
        
        for (var i = 0; i < dataArray.length; i++) {
            jsonData = jsonData + JSON.stringify(dataArray[i]._data);
        }
        return jsonData;
    },
    convertToCSV: function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    },
    
});

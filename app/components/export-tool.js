import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    processedData: Ember.computed( 'data', {
        get() {
            var dataArray = this.get('data');
            if (Ember.isPresent(dataArray)) {
                console.log(dataArray);
                // var dataArray = data.content;
                var jsonData = "";
                
                for (var i = 0; i < dataArray.length; i++) {
                    jsonData = jsonData + JSON.stringify(dataArray[i]._data);
                }
                //var csvData = this.convertToCSV(dataArray);
                return jsonData; 
            } else {
                return null;
            }
            
        }, 
        set(_, value) {
            this.set('processedData', value);
        }
    }),
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

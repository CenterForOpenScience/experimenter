import Ember from 'ember';
// import FileSaver from '../bower_components/file-saver.js/FileSaver.js';

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    defaultMappingFunction: function (model) {
        return model._data;
    },
    processedData: Ember.computed( 'data', 'mappingFunction', {
        get() {
            var dataArray = this.get('data');
            var mappingFunction = this.get('mappingFunction');
            if (Ember.isPresent(dataArray) && Ember.isPresent(mappingFunction)) {
                console.log(mappingFunction);
                var mapped = dataArray.map(mappingFunction);
                return this.convertToJSON(mapped); 
            } else if (Ember.isPresent(dataArray)) {
                var mapped = dataArray.map(this.get('defaultMappingFunction'));
                debugger;
                return this.convertToJSON(mapped); 
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
            jsonData = jsonData + JSON.stringify(dataArray[i]);
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
    actions: {
        downloadFile: function () {
            var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
            // this doesn't work right now
            FileSaver.saveAs(blob, "hello world.txt");
        }
    }
    
});

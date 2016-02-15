import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    dataFormat: 'JSON',
    dataFormats: [ 'JSON', 
        'CSV', 
    ],
    defaultMappingFunction: function (model) {
        return model._data;
    },
    processedData: Ember.computed( 'data', 'mappingFunction', 'dataFormat', {
        get() {
            var dataArray = this.get('data');
            var dataFormat = this.get('dataFormat');
            var mappingFunction = this.get('mappingFunction');
            if (Ember.isPresent(dataArray) && Ember.isPresent(mappingFunction)) {
                var mapped = dataArray.map(mappingFunction);
                return this.convertToFormat(mapped, dataFormat); 
            } else if (Ember.isPresent(dataArray)) {
                var mapped = dataArray.map(this.get('defaultMappingFunction'));
                return this.convertToFormat(mapped, dataFormat); 
            } else {
                return null;
            }
        }, 
        set(_, value) {
            this.set('processedData', value);
            return value;
        }
    }),
    convertToFormat: function (dataArray, format) {
        if (format === "JSON") {
            return JSON.stringify(dataArray); 
        } else {
            var array = typeof dataArray !== 'object' ? JSON.parse(dataArray) : dataArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                if (typeof array[i] === 'object') {
                    for (var index in array[i]) {
                        if (line !== '') line += ','

                        line += array[i][index];
                    }
                } else {
                    line += array[i];
                }
                str += line + '\r\n';
            }
            return str;
        }
    },
    actions: {
        downloadFile: function () {
            var blob = new Blob([this.get('processedData')], {type: "text/plain;charset=utf-8"});
            var extension = this.get('dataFormat').toLowerCase();
            saveAs(blob, "data." + extension);
        },
        selectDataFormat: function(dataFormat) {
          this.set('dataFormat', dataFormat);
        },
    }
    
});

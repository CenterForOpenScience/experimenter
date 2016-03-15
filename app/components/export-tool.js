import Ember from 'ember';

function rawValue(value) {
    return value;
}

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    dataFormat: 'JSON',
    dataFormats: [
        'JSON',
        'CSV'
    ],

    fieldWhitelist: null, // Optionally provide a whitelist of either ["fieldname"] or [{field: name, transform: function}] objects to control individual field serialization

    defaultMappingFunction: function (model) {
        var data = model._internalModel._data;  // Note: will not include results of computed properties
        var whitelist = this.get('fieldWhitelist');
        if (!whitelist) {
            return data;
        } else {  // Transform the passed-in fields according to a field whitelist
            var transformed = {};
            whitelist.forEach(function(item) {
                var transformFunc = item.transform || rawValue;
                var fieldName = item.field || item;
                transformed[fieldName] = transformFunc(data[fieldName]);
            });
            return transformed;
        }
    },
    processedData: Ember.computed( 'data', 'mappingFunction', 'dataFormat', {
        get() {
            var dataArray = this.get('data');
            var dataFormat = this.get('dataFormat');
            var mappingFunction = this.get('mappingFunction');
            var mapped;
            if (Ember.isPresent(dataArray) && Ember.isPresent(mappingFunction)) {
                mapped = dataArray.map(mappingFunction.bind(this));
                return this.convertToFormat(mapped, dataFormat);
            } else if (Ember.isPresent(dataArray)) {
                mapped = dataArray.map(this.get('defaultMappingFunction').bind(this));
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
        if (format === 'JSON') {
            return JSON.stringify(dataArray, undefined, 4);
        } else if (format==='CSV') {
            var array = typeof dataArray !== 'object' ? JSON.parse(dataArray) : dataArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                if (typeof array[i] === 'object') {
                    for (var index in array[i]) {
                        if (line !== '') {line += ',';}
                        line += array[i][index];
                    }
                } else {
                    line += array[i];
                }
                str += line + '\r\n';
            }
            return str;
        } else {
            throw 'Unrecognized file format specified';
        }
    },
    actions: {
        downloadFile: function () {
            var blob = new Blob([this.get('processedData')], {type: 'text/plain;charset=utf-8'});
            var extension = this.get('dataFormat').toLowerCase();
            saveAs(blob, 'data.' + extension);
        },
        selectDataFormat: function(dataFormat) {
          this.set('dataFormat', dataFormat);
        }
    }

});

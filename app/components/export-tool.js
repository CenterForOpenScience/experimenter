import Ember from 'ember';

/**
 * @module experimenter
 * @submodule components
  */

// Flatten a nested object into a single level, with dotted paths for keys
function squash(obj, prefix) {
    var ret = {};
    if (obj.serialize) {
        var serialized = obj.serialize();
        obj = serialized.data.attributes;
    }
    Ember.$.each(Object.keys(obj), (_, key) => {
        var value = Ember.get(obj, key);
        if (value && value.toJSON) {
            value = value.toJSON();
        }

        if (Ember.$.isPlainObject(value)) {
            ret = Ember.$.extend({}, ret, squash(value, prefix ? `${prefix}.${key}` : key));
        } else {
            ret[prefix ? `${prefix}.${key}` : key] = value;
        }
    });
    return ret;
}


/**
 * Export tool component: serializes records into one of a number of possible output formats
 * @class export-tool
 */
export default Ember.Component.extend({
    /**
     * @property data The data to be serialized
     */
    data: null,

    /**
     * Mapping function to transform a given (squashed) record. Should accept a single argument,
     *  a flattened object of {dotted.key: value} pairs.
     * @property {function} mappingFunction
     * @default noop
     */
    mappingFunction: null,

    dataFormat: 'JSON',
    dataFormats: [
        'JSON',
        'TSV'
    ],
    processedData: Ember.computed('data', 'dataFormat', function() {
        var data = this.get('data') || [];
        if (data.toArray) {
            data = data.toArray();
        }
        var dataArray = [];
        data.forEach((item /*, index, array*/ ) => { // Ensure that mapping function doesn't treat *index* as the optional recursive *prefix* parameter
            dataArray.push(squash.apply(this, [item]));
        });

        var dataFormat = this.get('dataFormat');
        var mappingFunction = this.get('mappingFunction') || ((x) => x);
        var mapped;
        if (Ember.isPresent(dataArray)) {
            mapped = dataArray.map(mappingFunction.bind(this));
            return this.convertToFormat(mapped, dataFormat);
        } else {
            return null;
        }
    }),
    convertToFormat: function(dataArray, format) {
        if (format === 'JSON') {
            return JSON.stringify(dataArray, undefined, 4);
        } else if (format === 'TSV') {
            var array = typeof dataArray !== 'object' ? JSON.parse(dataArray) : dataArray;

            var fields = Object.keys(array[0]);
            var tsv = [fields.join('\t')];
            Ember.$.each(array, function(_, item) {
                var line = [];
                fields.forEach(function(field) {
                    line.push(JSON.stringify(item[field]));
                });
                tsv.push(line.join('\t'));
            });
            tsv = tsv.join('\r\n');
            return tsv;
        } else {
            throw 'Unrecognized file format specified';
        }
    },
    actions: {
        downloadFile() {
            var blob = new window.Blob([this.get('processedData')], {
                type: 'text/plain;charset=utf-8'
            });
            var extension = this.get('dataFormat').toLowerCase();
            window.saveAs(blob, `data.${extension}`);
        },
        selectDataFormat(dataFormat) {
            this.set('dataFormat', dataFormat);
        }
    }

});

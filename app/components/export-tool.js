import Ember from 'ember';

function rawValue(value) {
    return value;
}

function flatten(obj) {
    var ret = [];
    Ember.$.each(Object.keys(obj), (_, key) => {
        ret.push([key, obj[key]]);
    });
    return ret;
}

function squash(obj, prefix) {
    prefix = prefix || '';

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
        }
        else {
            ret[prefix ? `${prefix}.${key}` : key] = value;
        }
    });
    return ret;
}

export default Ember.Component.extend({
    attributeBindings: ['data', 'mappingFunction'],
    dataFormat: 'JSON',
    dataFormats: [
        'JSON',
        'TSV'
    ],
    processedData: Ember.computed('data', 'dataFormat', {
        get() {
            var data = this.get('data') || [];
            if (data.toArray) {
                data = data.toArray();
            }
            var dataArray = Ember.$.map(data, (item) => squash(item));

            var dataFormat = this.get('dataFormat');
            var mappingFunction = this.get('mappingFunction') || ((x) => x);
            var mapped;
            if (Ember.isPresent(dataArray)) {
                mapped = dataArray.map(mappingFunction.bind(this));
                return this.convertToFormat(mapped, dataFormat);
            } else {
                return null;
            }
        }
    }),
    convertToFormat: function (dataArray, format) {
        if (format === 'JSON') {
            return JSON.stringify(dataArray, undefined, 4);
        } else if (format==='TSV') {
            var array = typeof dataArray !== 'object' ? JSON.parse(dataArray) : dataArray;

            var fields = Object.keys(array[0]);
            var tsv = [fields.join('\t')];
            Ember.$.each(array, function(_, item) {
                var line = [];
                Ember.$.each(fields, function(_, field) {
                    line.push(item[field]);
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

import Ember from 'ember';

/**
 * @module experimenter
 * @submodule components
  */

// Make sure that ember-data objects are serialized to a JS object
function serializeItem(obj) {
    if (obj.serialize) {
        var serialized = obj.serialize();
        obj = serialized.data.attributes;
    }
    return obj;
}

// Flatten a nested object into a single level, with dotted paths for keys
function squash(obj, prefix) {
    var ret = {};
    Object.keys(obj).forEach((key) => {
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
     *  a (possibly nested) JS object of fields
     * @property {function} mappingFunction
     * @default Return the item unchanged
     */
    mappingFunction(item) {
        return item;
    },

    dataFormat: 'JSON',
    // Recognized data formats. Hash of form {displayValue: Extension} items
    dataFormats: {
        JSON: 'JSON',
        TSV: 'TSV',
        'TSV (for ISP)': 'TSV',
    },

    processedData: Ember.computed('data', 'dataFormat', function() {
        var data = this.get('data') || [];
        if (data.toArray) {
            data = data.toArray();
        }
        let dataArray = data.map(serializeItem);

        var dataFormat = this.get('dataFormat');
        var mappingFunction = this.get('mappingFunction');

        if (Ember.isPresent(dataArray)) {
            let mapped = dataArray.map(mappingFunction);
            return this.convertToFormat(mapped, dataFormat);
        } else {
            return null;
        }
    }),

    _convertToJSON(dataArray) {
        return JSON.stringify(dataArray, null, 4);
    },
    _convertToTSV(dataArray) {
        // Flatten the dictionary keys for readable column headers
        let squashed = dataArray.map((item => squash(item)));

        var fields = Object.keys(squashed[0]);
        var tsv = [fields.join('\t')];

        squashed.forEach((item) => {
            var line = [];
            fields.forEach(function(field) {
                line.push(JSON.stringify(item[field]));
            });
            tsv.push(line.join('\t'));
        });
        tsv = tsv.join('\r\n');
        return tsv;
    },
    _convertToISP(dataArray) {
        // ISP-specific TSV file format

        // First custom field mapping...

        // Then serialize to TSV
        dataArray = dataArray.map((record) => {
            let newRecord = {};
            for (let frameId of Object.keys(record.expData)) {
                newRecord[frameId] = record.expData[frameId].responses || {};
            }
            return newRecord;
        });
        return this._convertToTSV(dataArray);
    },
    convertToFormat(dataArray, format) {
        if (format === 'JSON') {
            return this._convertToJSON(dataArray);
        } else if (format === 'TSV') {
            return this._convertToTSV(dataArray);
        } else if (format === 'TSV (for ISP)') {
            return this._convertToISP(dataArray);
        } else {
            throw 'Unrecognized file format specified';
        }
    },
    actions: {
        downloadFile() {
            let blob = new window.Blob([this.get('processedData')], {
                type: 'text/plain;charset=utf-8'
            });
            let format = this.get('dataFormat');
            let extension = this.get('dataFormats')[format].toLowerCase();
            window.saveAs(blob, `data.${extension}`);
        },
        selectDataFormat(dataFormat) {
            this.set('dataFormat', dataFormat);
        }
    }
});

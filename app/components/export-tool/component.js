import Ember from 'ember';

/**
 * @module experimenter
 * @submodule components
 */

/**
 * Make sure that ember-data objects are serialized to a JS object
 *
 * @param obj
 * @returns {*}
 */
function serializeItem(obj) {
    if (obj.serialize) {
        obj = obj.serialize().data.attributes;
    }
    return obj;
}

/**
 * Flatten a nested object into a single level, with dotted paths for keys
 *
 * @param obj
 * @param prefix
 * @returns {Object}
 */
function squash(obj, prefix) {
    let ret = {};

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }

        const newPrefix = prefix ? `${prefix}.${key}` : key;

        let value = Ember.get(obj, key);

        if (value && value.toJSON) {
            value = value.toJSON();
        }

        if (Ember.$.isPlainObject(value)) {
            Object.assign(ret, squash(value, newPrefix));
        } else {
            ret[newPrefix] = value;
        }
    }

    return ret;
}

/**
 * Makes a value safe for a CSV
 *
 * @param val {boolean|null|number|undefined|string} - The value to serialize
 * @returns {string}
 */
function csvSafe(val) {
    const value = JSON.stringify(val);
    return value ? value.replace(/\\"/g, '""') : '';
}

/**
 * Export tool component: serializes records into one of a number of possible output formats
 * @class export-tool
 */
export default Ember.Component.extend({
    /**
     * @property {null|Array<Object>} data The data to be serialized
     */
    data: null,

    /**
     * Mapping function to transform a given (squashed) record. Should accept a single argument,
     *  a (possibly nested) JS object of fields
     *
     * @property {function|null} mappingFunction
     * @default null
     */
    mappingFunction: null,

    /** @property {('JSON'|'CSV')} the data format */
    dataFormat: 'JSON',

    /**
     * Recognized data formats. Hash of form `{displayValue: Extension}` items
     *
     * @enum {string}
     */
    dataFormats: {
        JSON: 'JSON',
        CSV: 'CSV',
        'CSV (for ISP)': 'CSV'
    },

    /**
     * @property {null|string} The processed data
     */
    processedData: Ember.computed('data', 'dataFormat', 'mappingFunction', function() {
        let data = this.get('data') || [];
        if (data.toArray) {
            data = data.toArray();
        }
        let dataArray = data.map(serializeItem);

        const dataFormat = this.get('dataFormat');
        const mappingFunction = this.get('mappingFunction');

        if (Ember.isPresent(dataArray)) {
            const mapped = mappingFunction ? dataArray.map(mappingFunction) : dataArray;
            return this.convertToFormat(mapped, dataFormat);
        }

        return null;
    }),

    /**
     * Converts an array to a JSON string
     *
     * @param dataArray {!Array<Object>} - The rows of the CSV
     * @private
     * @returns {string}
     */
    _convertToJSON(dataArray) {
        return JSON.stringify(dataArray, null, 4);
    },

    /**
     * Converts an array to a standard CSV file
     *
     * @param dataArray {!Array<Object>} - The rows of the CSV
     * @private
     * @returns {string}
     */
    _convertToCSV(dataArray) {
        // Flatten the dictionary keys for readable column headers
        const squashed = dataArray.map(item => squash(item));

        const fields = Object.keys(squashed[0]);
        const csv = [fields.join()];

        for (const item of squashed) {
            const line = [];

            for (const field of fields) {
                line.push(csvSafe(item[field]));
            }

            csv.push(line.join());
        }

        return csv.join('\r\n');
    },

    /**
     * Converts an array to a standard CSV file
     *
     * @param dataArray {!Array<Object>} - The rows of the CSV
     * @private
     * @returns {string}
     */
    _convertToISP(dataArray) {
        // ISP-specific CSV file format

        // First custom field mapping...

        // Then serialize to CSV
        dataArray = dataArray.map((record) => {
            let newRecord = {};

            for (let frameId of Object.keys(record.expData)) {
                let responses = record.expData[frameId].responses || {};

                for (let question of Object.keys(responses)) {
                    if (frameId === '3-3-rating-form') {
                        for (let item of Object.keys(responses[question])) {
                            newRecord[item] = responses[question][item];
                        }
                    } else {
                        newRecord[question] = responses[question];
                    }
                }
            }

            return newRecord;
        });
        return this._convertToCSV(dataArray);
    },

    /**
     * Converts an array to the specified format
     *
     * @param dataArray {!Array<Object>} - The rows
     * @param format {!dataFormats} - The conversion output format
     * @returns {string}
     */
    convertToFormat(dataArray, format) {
        switch (format) {
            case 'JSON':
                return this._convertToJSON(dataArray);
            case 'CSV':
                return this._convertToCSV(dataArray);
            case 'CSV (for ISP)':
                return this._convertToISP(dataArray);
            default:
                throw new Error('Unrecognized file format specified');
        }
    },

    actions: {
        /**
         * Creates a file for the user to download
         */
        downloadFile() {
            const blob = new window.Blob([this.get('processedData')], {
                type: 'text/plain;charset=utf-8'
            });

            const format = this.get('dataFormat');
            const extension = this.get('dataFormats')[format].toLowerCase();

            window.saveAs(blob, `data.${extension}`);
        },

        /**
         * Sets the current data format
         *
         * @param dataFormat {dataFormats}
         */
        selectDataFormat(dataFormat) {
            this.set('dataFormat', dataFormat);
        }
    }
});

import Ember from 'ember';
import { writeCSV, squash, uniqueFields } from 'exp-models/utils/csv-writer';
import ispFields from './isp-fields';

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
 * Export tool component: serializes records into one of a number of possible output formats
 * @class export-tool
 */
export default Ember.Component.extend({
    /**
     * @property {null|Object[]} data The data to be serialized
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
     * @property {Object.String}
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

        const dataArray = data.map(serializeItem);
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
     * @param {Object[]} dataArray An array of objects
     * @private
     * @returns {string}
     */
    _convertToJSON(dataArray) {
        return JSON.stringify(dataArray, null, 4);
    },

    /**
     * Converts an array to a standard CSV file
     *
     * @param {Object[]} dataArray The rows of the CSV
     * @private
     * @returns {string}
     */
    _convertToCSV(dataArray) {
        const data = dataArray.map(squash);
        const fields = uniqueFields(data);
        return writeCSV(data, fields);
    },

    /**
     * Converts an array to a standard CSV file
     *
     * @param {Object[]} dataArray The rows of the CSV
     * @private
     * @returns {string}
     */
    _convertToISP(dataArray) {
        // ISP-specific CSV file format
        const normalizedArray = dataArray
            .map(record => {
                // Rename a few fields to match the spec'ed output
                const newRecord = {
                    PID: record.profileId,
                    SID: record.extra.studyId,
                    completed: record.modifiedOn,
                    locale: record.extra.locale
                };

                for (const frameId of Object.keys(record.expData)) {
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

                const squashedRecord = squash(newRecord);
                const keys = Object.keys(squashedRecord);

                for (const key of keys) {
                    if (key.includes('.')) {
                        squashedRecord[key.replace('.', '_')] = squashedRecord[key];
                        delete squashedRecord[key];
                    }
                }

                return squashedRecord;
            });

        return writeCSV(normalizedArray, ispFields);
    },

    /**
     * Converts an array to the specified format
     *
     * @param {Object[]} dataArray An array of objects
     * @param {dataFormats} format The conversion output format
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
         * @param {dataFormats} dataFormat
         */
        selectDataFormat(dataFormat) {
            this.set('dataFormat', dataFormat);
        }
    }
});

import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

/**
 * @module experimenter
 * @submodule components
 */

// h/t: http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(len) {
    let text = '';
    const possible = '0123456789';

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const Validations = buildValidations({
    batchSize: validator('number', {
        gt: 0,
        lte: 100,
        integer: true,
        allowString: true
    }),
    studyId: validator('presence', {
        presence: true,
        ignoreBlank: true
    })
});

/**
 * Participant creator page in component form.
 *
 * Sample usage:
 * ```handlebars
 *  {{participant-creator}}
 * ```
 * @class participant-creator
 */
export default Ember.Component.extend(Validations, {
    store: Ember.inject.service(),
    toast: Ember.inject.service(),

    batchSize: 1,
    tag: null,
    studyId: null,
    extra: null,
    nextExtra: '',
    invalidFieldName: false,

    creating: false,
    createdAccounts: null,
    showErrors: false,

    init() {
        this._super(...arguments);
        this.set('extra', Ember.A());
        this.set('createdAccounts', []);
    },
    /**
     * Generate an array of ID strings
     * @param batchSize
     * @param tag
     * @returns {String[]}
     * @private
     */
    _generate(batchSize, tag) {
        var ret = [];
        for (let i = 0; i < batchSize; i++) {
            ret.push(`${makeId(10)}${tag ? `_${tag}` : ''}`);
        }
        return ret;
    },

    /**
     * @method _sendBulkRequest Send a single (bulk) ajax request and return a promise
     * @param {String} modelName The name of the record type to create (eg
     * @param {Object[]} attributes An array of attributes objects, as would be passed to `createRecord` for the corresponding model name
     * @returns {Promise} A promise that resolves to the array of new, quasi-unsaved ember model objects
     * @private
     */
    _sendBulkRequest(modelName, attributes) {
        // Serialize the attributes as though creating a new record
        const records = attributes.map(obj => this.get('store').createRecord(modelName, obj));
        const payload = records.map(rec => rec.serialize({includeId: true}).data);
        const adapter = this.get('store').adapterFor(modelName);
        const url = adapter.buildURL(modelName, null, null, 'createRecord');  // url templates bypass urlfor<x> methods
        return adapter.ajax(url, 'POST', {
            data: { data: payload },
            isBulk: true
        }).then((res) => {
            // JamDB bulk responses can include placeholder null values in the data array, if the corresponding
            //  request array item failed. Filter these error placeholders out to get just records created, and map
            // them from long Jam IDs to the short ones used here
            const createdIDs = new Set((res.data || []).filter(item => !!item).map(item => item.id.split('.').pop()));
            // Return the records that actually got created on the server, and clean up the remainder that errored
            // This is an ugly side effect of the various ways that we are bypassing the ember data store
            const createdRecords = [];
            const erroredRecords = [];
            records.forEach(item => {
                if (createdIDs.has(item.id)) {
                    createdRecords.push(item);
                } else {
                    erroredRecords.push(item);
                }
            });
            this._clearAccounts(erroredRecords, false);
            return createdRecords;
        });
    },

    /**
     * Clear temporary and quasi-unsaved account objects from the store
     * @method _clearAccounts
     * @parameter A list of records to unload
     * @parameter {Boolean} clear Whether to clear the entire list of created accounts stored locally
     * @private
     */
    _clearAccounts(accounts, clear=true) {
        accounts = accounts || this.get('createdAccounts');
        if (accounts) {
            accounts.forEach(item => {
                this.get('store').deleteRecord(item);
            });
        }
        if (clear) {
            this.set('createdAccounts', []);
        }
    },

    accountsToCSV() {
        var keys = ['id', 'extra.studyId'].concat(this.get('extra').map(e => `extra.${e.key}`));
        return keys.join(',') + '\n' + this.get('createdAccounts').map((a) => {
            var props = a.getProperties(keys);
            return keys.map(k => props[k]).join(',');
        }).join('\n');
    },

    exampleId: Ember.computed('tag', function() {
        var tag = this.get('tag');
        return `12345${tag ? `_${tag}` : ''}`;
    }),

    actions: {
        createParticipants(batchSize) {
            // Only show messages after first attempt to submit form
            this.set('showErrors', true);
            if (!this.get('validations.isValid')) {
                return;
            }

            // Each new batch of contributors creates a new CSV file with no records from the previous batch
            this._clearAccounts();

            var studyId = this.get('studyId');

            var tag = this.get('tag');
            batchSize = parseInt(batchSize) || 0;
            var accountIDs = this._generate(batchSize, tag);

            var extra = {};
            extra.studyId = studyId;
            this.get('extra').forEach(item => {
                extra[item.key] = item.value;
            });
            const accounts = accountIDs.map(id => ({id, password: studyId, extra}));
            // TODO: Use the server response errors field to identify any IDs that might already be in use:
            // as written, we don't retry to create those. If 3 of 100 requested items fail, we just create 97 items and call it a day.
            this.set('creating', true);

            // This step is very slow because each password has to be bcrypted- on the front end (jamdb implementation detail).
            //   Do that in a separate run loop so that UI status indicator can render while we wait; otherwise
            //   rerender blocks until after the server request has been sent.
            this.rerender();
            Ember.run.next(() => {
                this._sendBulkRequest('account', accounts)
                    .then((res) => {
                        if (res.length > 0) {
                            // Store all the records that were successfully created,
                            // adding them to all records from previous requests while on this page.
                            // Eg, a combined CSV could be generated with 200 records.
                            this.get('createdAccounts').push(...res);
                            // This may sometimes be smaller than batchSize, in the rare event that a single record appears
                            // in res.errors instead, eg because ID was already in use
                            this.toast.info(`Successfully created ${res.length} accounts!`);
                            this.send('downloadCSV');
                        } else {
                            // Likely, every ID in this request failed to create for some horrible reason (data.length=0
                            // and errors.length=batchSize after filtering out spurious null entries)
                            this.get('toast').error('Could not create new account(s). If this error persists, please contact support.');
                        }
                    })
                    .catch(() => this.get('toast').error('Could not create new accounts. Please try again later.'))
                    .finally(() => this.set('creating', false));
            });
        },
        addExtraField() {
            var next = this.get('nextExtra');
            var fieldExists = false;
            // Do not allow users to add duplicate studyId field
            if (next === 'studyId') {
                fieldExists = true;
            }
            for (var item of this.get('extra')) {
                if (item.key === next) {
                    fieldExists = true;
                    break;
                }
            }
            if (fieldExists) {
                this.set('invalidFieldName', true);
            } else {
                this.get('extra').pushObject({
                    key: next,
                    value: null
                });
            }
            this.set('nextExtra', null);
        },
        removeExtraField(field) {
            var extra = this.get('extra');
            this.set('extra', extra.filter((item) => item.key !== field));
        },
        downloadCSV() {
            const content = this.accountsToCSV();
            var blob = new window.Blob([content], {
                type: 'text/plain;charset=utf-8'
            });
            window.saveAs(blob, 'participants.csv');
        },
        toggleInvalidFieldName: function() {
            this.toggleProperty('invalidFieldName');
        }
    },
    willDestroy() {
        this._clearAccounts();
    }
});

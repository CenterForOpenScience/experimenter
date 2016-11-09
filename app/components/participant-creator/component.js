import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

/**
 * @module experimenter
 * @submodule components
 */

// h/t: http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; i++) {
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
    extra: null,
    nextExtra: '',
    useAsPassword: null,

    creating: false,
    createdAccounts: null,

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
            ret.push(`${makeId(5)}${tag ? `-${tag}` : ''}`);
        }
        return ret;
    },

    /**
     * @method _sendBulkRequest Send a single (bulk) ajax request and return a promise
     * @param {String} modelName The name of the record type to create (eg
     * @param {Object[]} attributes An array of attributes objects, as would be passed to `createRecord` for the corresponding model name
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
        });
    },

    generatedParticipants: Ember.computed('batchSize', 'tag', function() {
        var tag = this.get('tag');
        var batchSize = Math.min(parseInt(this.get('batchSize')) || 0, 10);
        return this._generate(batchSize, tag);
    }),

    createdAccountsCSV: Ember.computed('createdAccounts', function() {
        var keys = ['id'].concat(this.get('extra').map(e => `extra.${e.key}`));
        return keys.join(',') + '\n' + this.get('createdAccounts').map((a) => {
            var props = a.getProperties(keys);
            return keys.map(k => props[k]).join(',');
        }).join('\n');
    }),
    actions: {
        createParticipants(batchSize) {
            var tag = this.get('tag');
            batchSize = parseInt(batchSize) || 0;
            var accountIDs = this._generate(batchSize, tag);

            var extra = {};
            var useAsPassword = this.get('useAsPassword');
            var password = '';
            this.get('extra').forEach(item => {
                if (item.key === useAsPassword) {
                    password = Ember.get(item, 'value');
                }
                extra[item.key] = item.value;
            });
            if (!useAsPassword) {
                password = makeId(10);
            }

            const accounts = accountIDs.map(id => ({id, password}));


            // TODO: Use the server response errors field to identify any IDs that might already be in use:
            // this does not implement any record collision detection as written

            // TODO: Add correctly saved records into the field used to generate the CSV, and notify user on success
            this.set('creating', true);
            this._sendBulkRequest('account', accounts)
                .then((res) => {
                    // JamDB bulk responses can include placeholder null values in the data array, if the corresponding
                    //  request array item failed. Filter error dummies out before reporting the records created.
                    // TODO: Simplify the CSV serializer later; it's now being passed objects instead of record instances but that should be fine
                    const data = (res.data || []).filter(item => !!item);
                    if (data.length > 0) {
                        this.get('createdAccounts').push(...data);
                        // This may sometimes be smaller than batchSize, in the rare event that a single record appears
                        // in errors instead, eg because ID was already in use
                        this.toast.info(`Successfully created ${data.length} accounts!`);
                        this.send('downloadCSV');
                    } else {
                        // Likely, every ID in this request failed to create for some horrible reason (data.length=0
                        // and errors.length=batchSize after filtering out spurious null entries)
                        this.get('toast').error('Could not create new account(s). If this error persists, please contact support.');
                    }
                })
                .catch(() => this.get('toast').error('Could not create new accounts. Please try again later.'))
                .finally(() => this.set('creating', false));
        },
        addExtraField() {
            var next = this.get('nextExtra');
            this.get('extra').pushObject({
                key: next,
                value: null
            });
            this.set('nextExtra', null);
        },
        removeExtraField(field) {
            var extra = this.get('extra');
            this.set('extra', extra.filter((item) => item.key !== field));
        },
        useAsPassword(field, checked) {
            if (checked) {
                this.set('useAsPassword', field);
            } else {
                this.set('useAsPassword', null);
            }
        },
        downloadCSV: function() {
            var blob = new window.Blob([this.get('createdAccountsCSV')], {
                type: 'text/plain;charset=utf-8'
            });
            window.saveAs(blob, 'participants.csv');
        }
    }
});

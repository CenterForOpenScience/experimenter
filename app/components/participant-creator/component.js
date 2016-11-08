import Ember from 'ember';

// h/t: http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeId(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default Ember.Component.extend({
    store: Ember.inject.service(),

    batchSize: 1,
    tag: null,
    studyId: null,
    extra: null,
    nextExtra: '',
    invalidStudyId: false,
    invalidFieldName: false,

    creating: false,
    createdAccounts: [],
    _creatingPromise: null,

    init() {
        this._super(...arguments);
        this.set('extra', Ember.A());
    },

    _generate(batchSize, tag) {
        var ret = [];
        for (let i = 0; i < batchSize; i++) {
            ret.push(`${makeId(5)}${tag ? `-${tag}` : ''}`);
        }
        return ret;
    },
    exampleId: Ember.computed('tag', function() {
        var tag = this.get('tag');
        return `12345${tag ? `-${tag}` : ''}`;
    }),

    createdAccountsCSV: Ember.computed('createdAccounts', function() {
        var keys = ['id', 'extra.studyId'].concat(this.get('extra').map(e => `extra.${e.key}`));
        return keys.join(',') + '\n' + this.get('createdAccounts').map((a) => {
            var props = a.getProperties(keys);
            return keys.map(k => props[k]).join(',');
        }).join('\n');
    }),
    actions: {
        createParticipants() {
            Ember.run(() => {
                console.log('creating...');
                this.set('creating', true);
                this.set('createdAccounts', []);
            });

            var tag = this.get('tag');
            var batchSize = parseInt(this.get('batchSize')) || 0;
            var accounts = this._generate(batchSize, tag);
            var store = this.get('store');

            var extra = {};
            var studyId = this.get('studyId');
            if (!studyId || !studyId.trim()) {
                this.set('invalidStudyId', true);
                this.set('creating', false);
                return;
            }
            extra['studyId'] = studyId;
            this.get('extra').forEach(item => {
                extra[item.key] = item.value;
            });

            Ember.run.later(this, () => {
                this.set('_creatingPromise', Ember.RSVP.allSettled(
                    accounts.map((aId) => {
                        var attrs = {
                            id: aId,
                            password: studyId,
                            extra: extra
                        };
                        var acc = store.createRecord('account', attrs);
                        console.log(`Saving ${acc.get('id')}`);
                        return acc.save().then(() => {
                            this.get('createdAccounts').pushObject(acc);
                            console.log(`Saved ${acc.get('id')}`);
                        });
                    })
                ).then(() => {
                    Ember.run.later(this, () => {
                        this.set('creating', false);
                        this.send('downloadCSV');
                    }, 100);
                }));
            }, 50);
        },
        addExtraField() {
            var next = this.get('nextExtra');
            var fieldExists = false;
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
        downloadCSV: function() {
            var blob = new window.Blob([this.get('createdAccountsCSV')], {
                type: 'text/plain;charset=utf-8'
            });
            window.saveAs(blob, 'participants.csv');
        },
        toggleInvalidStudyId: function() {
            this.toggleProperty('invalidStudyId');
        },
        toggleInvalidFieldName: function() {
            this.toggleProperty('invalidFieldName');
        }
    }
});

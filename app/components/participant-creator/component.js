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
    extra: null,
    nextExtra: '',
    useAsPassword: null,

    creating: false,
    createdCount: 0,
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
    generatedParticipants: Ember.computed('batchSize', 'tag', function() {
        var tag = this.get('tag');
        var batchSize = Math.min(parseInt(this.get('batchSize')) || 0, 10);
        return this._generate(batchSize, tag);
    }),
    actions: {
        createParticipants() {
            Ember.run(() => {
                console.log('creating...');
                this.set('creating', true);
                this.set('createdCount', 0);
            });

            var tag = this.get('tag');
            var batchSize = parseInt(this.get('batchSize')) || 0;
            var accounts = this._generate(batchSize, tag);
            var store = this.get('store');

            var extra = this.get('extra');
            var useAsPassword = this.get('useAsPassword');
            var password = '';
            if (useAsPassword) {
                var item = extra.filter((a) => a.key === useAsPassword)[0];
                if (item) {
                    password = Ember.get(item, 'value');
                }
            } else {
                password = makeId(10);
            }
            Ember.run.later(this, () => {
                this.set('_creatingPromise', Ember.RSVP.allSettled(
                    accounts.map((aId) => {
                        var attrs = {
                            id: aId,
                            password: password
                        };
                        Ember.merge(attrs, extra);
                        var acc = store.createRecord('account', attrs);
                        console.log(`Saving ${acc.get('id')}`);
                        return acc.save().then(() => {
                            this.incrementProperty('createdCount');
                            console.log(`Saved ${acc.get('id')}`);
                        });
                    })
                ).then(() => {
                    Ember.run.later(this, () => {
                        this.set('creating', false);
                    }, 100);
                }));
            }, 50);
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
                this.set('useAsPassword', checked);
            } else {
                this.set('useAsPassword', null);
            }
        }
    }
});

import Ember from 'ember';

let ASC = '';
let DESC = '-';

export default Ember.Controller.extend({
    newTitle: '',
    isShowingModal: false,
    queryParams: ['sort', 'match', 'state', 'q'],
    state: 'All',
    match: null,
    sort: 'modified_on',
    sortProperty: Ember.computed('sort', {
        get() {
            var sort = this.get('sort');
            if (sort) {
                return sort.replace(DESC, '');
            }
            else {
                return null;
            }
        },
        set (_, value) {
            var sort = this.get('sort');
            if (sort) {
                var sign = sort.indexOf(DESC) === 0 ? DESC : ASC;
                this.set('sort', `${sign}${value}`);
            }
            else {
                this.set('sort', `${ASC}${value}`);
            }
            return value;
        }
    }),
    sortOrder: Ember.computed('sort', {
        get() {
            var sort = this.get('sort');
            if (sort) {
                return sort.indexOf(DESC) === 0 ? DESC : ASC;
            }
            else {
                return null;
            }
        },
        set (_, value) {
            var sort = this.get('sort');
            if (sort) {
                var prop = sort.replace(DESC, '');
                this.set('sort', `${value}${prop}`);
            }
            else {
                this.set('sort', `${value}title`);
            }
            return value;
        }
    }),
    toggleOrder: function(order) {
        if (order === ASC) {
            this.set('sortOrder', DESC);
        } else {
            this.set('sortOrder', ASC);
        }
    },
    activeButtons: ['Active', 'Draft', 'Archived', 'All'],
    actions: {
        selectStatusFilter: function(status) {
            this.set('state', status);
            this.set('sortProperty', 'title');
            this.set('sortOrder', ASC);
        },
        sortingMethod: function(sortProperty) {
            if (Ember.isEqual(this.get('sortProperty'), sortProperty)) {
                this.toggleOrder(this.get('sortOrder'));
            } else {
                this.set('sortOrder', ASC);
            }
            this.set('sortProperty', sortProperty);
        },
        resetParams: function() {
            this.set('state', null);
            this.set('match', null);
            this.set('sortProperty', 'title');
            this.set('sortOrder', ASC);
        },
        updateSearch: function(value) {
            this.set('match', `${value}`);
            this.set('sortProperty', null);
        },
        toggleModal: function() {
            this.set('newTitle', '');
            this.toggleProperty('isShowingModal');
        },
        createExperiment: function() {
            var newExperiment = this.store.createRecord('experiment', {
                // should work after split bug is fixed and schema validation handles null values
                // for structure, beginDate, endDate, and eligibilityCriteria
                title: this.get('newTitle'),
                description: 'Give your experiment a description here...',  // TODO: Hardcoded parameter
                state: 'Draft',
                lastEdited: new Date(),
                purpose: 'Explain the purpose of your experiment here...',
                duration: 'Not specified',
                exitUrl: '',
                structure: {
                    frames: {},
                    sequence: []
                }
            });
            var onCreateSessionCollection = () => {
                this.send('toggleModal');
                this.set('newTitle', null);
                this.transitionToRoute('experiments.info', newExperiment.id);
            };
            newExperiment.on('didCreate', () => {
                if (newExperiment.get('_sessionCollection.isNew')) {
                    newExperiment.get('_sessionCollection').on('didCreate', onCreateSessionCollection);
                }
                else {
                    onCreateSessionCollection();
                }
            });
            newExperiment.save();
        }
    }
});

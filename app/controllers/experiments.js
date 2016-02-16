import Ember from 'ember';

let ASC = '';
let DESC = '-';

export default Ember.Controller.extend({
    breadCrumb: 'Experiments',
    queryParams: ['sort', 'match', 'active', 'q'],
    active: null,
    match: null,
    sort: 'title',
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
    actions: {
        selectStatusFilter: function(status) {
            this.set('active', status);
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
            this.set('active', null);
            this.set('match', null);
            this.set('sortProperty', 'title');
            this.set('sortOrder', ASC);
        },
        updateSearch: function(value) {
            this.set('match', `${value}*`);
            this.set('sortProperty', null);
        }
    }
});

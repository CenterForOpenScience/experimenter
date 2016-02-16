import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Experiments',
    queryParams: ['sort', 'match', 'active'],
    active: null,
    match: '*',
    sort: 'title:asc',
    sortProperty: Ember.computed('sort', {
        get() {
            var sort = this.get('sort');
            if (sort) {
                var [prop,] = sort.split(':');
                return prop;
            }
            else {
                return null;
            }
        },
        set (_, value) {
            var sort = this.get('sort');
            if (sort) {
                var [, order] = sort.split(':');
                this.set('sort', `${value}:${order}`);
            }
            else {
                this.set('sort', `${value}:asc`);
            }
        }
    }),
    sortOrder: Ember.computed('sort', {
        get() {
            var sort = this.get('sort');
            if (sort) {
                var [, order] = sort.split(':');
                return order;
            }
            else {
                return null;
            }
        },
        set (_, value) {
            var sort = this.get('sort');
            if (sort) {
                var [prop, ] = sort.split(':');
                this.set('sort', `${prop}:${value}`);
            }
            else {
                this.set('sort', `title:${value}`);
            }
        }
    }),
    toggleOrder: function(order) {
        if (order === 'asc') {
            this.set('sortOrder', 'desc');
        } else {
            this.set('sortOrder', 'asc');
        }
    },
    actions: {
        selectStatusFilter: function(status) {
            this.set('active', status);
            this.set('sortProperty', 'title');
            this.set('sortOrder', 'asc');
        },
        sortingMethod: function(sortProperty) {
            if (this.get('sortProperty') === sortProperty) {
                this.toggleOrder(this.get('sortOrder'));
            } else {
                this.set('sortOrder', 'asc');
            }
            this.set('sortProperty', sortProperty);
        },
        resetParams: function() {
            this.set('active', null);
            this.set('match', '*');
            this.set('sortProperty', 'title');
            this.set('sortOrder', 'asc');
        },
        updateSearch: function(value) {
            this.set('match', value);
            this.set('sortProperty', null);
        }
    }
});

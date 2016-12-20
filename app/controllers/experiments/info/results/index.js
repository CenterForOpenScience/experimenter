import Ember from 'ember';
import PaginatedControllerMixin from '../../../../mixins/paginated-controller';

export default Ember.Controller.extend(PaginatedControllerMixin, {
    page_size: 10,

    queryParams: ['sort'],
    sort: '',

    totalPages: Ember.computed('model', function() {
        return Math.ceil(this.get('model.meta.total') / this.get('page_size'));
    }),

    actions: {
        /**
         * Change the sort direction (and adapt field names from ember-data to raw queries)
         *
         * @param {String} field name
         * @param reverse
         */
        changeSort(field, reverse) {
            const direction = reverse ? '-' : '+';
            this.set('sort', direction + field);
        }
    }
});

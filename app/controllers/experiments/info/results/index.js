import Ember from 'ember';
import PaginatedControllerMixin from '../../../../mixins/paginated-controller';

export default Ember.Controller.extend(PaginatedControllerMixin, {
    page_size: 20,

    totalPages: Ember.computed('model', function() {
        return Math.ceil(this.get('model.meta.total') / this.get('page_size'));
    })
});

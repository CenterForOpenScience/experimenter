import Ember from 'ember';
import PaginatedControllerMixin from '../../../../mixins/paginated-controller';

export default Ember.Controller.extend(PaginatedControllerMixin, {
    page_size: 20,
});

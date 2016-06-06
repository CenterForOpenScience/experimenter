import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb: 'Preview',
    experiment: null,
    session: null,
    isDirty: function() {
        return this.get('model.hasDirtyAttributes');
    },

    _resolve: null,
    previewData: null,
    showData: false,
    showPreviewData(session) {
        return new Ember.RSVP.Promise((resolve) => {
            this.set('previewData', JSON.stringify(session.toJSON(), null, 4));
            this.set('showData', true);

            this.set('_resolve', resolve);
        });
    },
    actions: {
        toggleData() {
            this.toggleProperty('showData');
            this.get('_resolve')();
        }
    }
});

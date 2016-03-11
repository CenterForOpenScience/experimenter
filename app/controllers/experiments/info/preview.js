import Ember from 'ember';

import WarnOnExitControllerMixin from 'exp-player/mixins/warn-on-exit-controller';

export default Ember.Controller.extend(WarnOnExitControllerMixin, {
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

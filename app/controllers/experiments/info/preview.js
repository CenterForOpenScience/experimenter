import Ember from 'ember';

import WarnOnExitControllerMixin from 'exp-player/mixins/warn-on-exit-controller';

export default Ember.Controller.extend(WarnOnExitControllerMixin, {
    breadCrumb: 'Preview',
    experiment: null,
    session: null,
    isDirty: function() {
        return this.get('model.hasDirtyAttributes');
    },
});

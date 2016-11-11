import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    isExpanded: true,
    isNotLogin: Ember.computed('currentPath', function() {
        return this.get('currentPath') !== 'login';
    }),
    sizeContainer: function() {
        var winWidth = Ember.$(window).width();
        if (winWidth < 992 && this.isExpanded) {
            this.send('toggleMenu');
        }
    },
    attachResizeListener : function () {
        Ember.$(window).on('resize', Ember.run.bind(this, this.sizeContainer));
    }.on('init'),

    actions: {
        toggleMenu: function() {
            this.toggleProperty('isExpanded');
        },
        invalidateSession: function() {
            return this.get('session').invalidate().then(() => {
                window.location.reload(true);
            });
        }
    }
});

import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    isExpanded: true,
    isNotLogin: Ember.computed('this.currentPath', function() {
        if (this.currentPath !== 'login') {
            return true;
        } else {
            return false;
        }
    }),
    sizeContainer: function() {
        var winWidth = $(window).width();
        if (winWidth < 992 && this.isExpanded) {
            this.send('toggleMenu');
        }
    },
    attachResizeListener : function () {
        $(window).on('resize', Ember.run.bind(this, this.sizeContainer));
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

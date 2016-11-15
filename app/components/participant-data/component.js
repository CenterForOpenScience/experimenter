import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['sessions'],
    participantSession: '',
    sortBy: 'profileId',
    reverse: false,
    mappingFunction: null,
    sortedSessions: Ember.computed('sortBy', 'reverse', {
        get() {
            var reverse = this.get('reverse');
            var sortBy = this.get('sortBy');
            if (reverse) {
                return this.get('sessions').sortBy(sortBy).reverse();
            }
            return this.get('sessions').sortBy(sortBy);
        },
        set(_, value) {
            this.set('sortedSessions', value);
            return value;
        }
    }),
    actions: {
        updateData: function(session) {
            this.set('participantSession', [session]);
        },
        toggleSort: function() {
            this.toggleProperty('reverse');
        },
        updateSortBy: function(sortBy) {
            if (this.get('sortBy') === sortBy) {
                this.send('toggleSort');
            } else {
                this.set('reverse', false);
            }
            this.set('sortBy', sortBy);
        }
    }
});

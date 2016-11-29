import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ['sessions'],
    participantSession: '',
    sortBy: 'profileId',
    reverse: false,
    mappingFunction: null,

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

            const rawField = sortBy === 'modifiedOn' ? 'modified_on' : sortBy;
            this.sendAction('changeSort', rawField, this.get('reverse'));
        }
    }
});

import Ember from 'ember';

export default Ember.Mixin.create({
    payloadKeyFromModelName: function(modelName) {
        // JamDB expects all collections to specify JSONAPI type 'documents'
        return 'documents';
    },

    extractRelationships: function(modelClass, resourceHash) {
        var relationships = this._super(...arguments);
        // Manually rebuild the history relationship. This can be removed upon resolution of
        // issue with the auto-generated history link: ticket https://github.com/CenterForOpenScience/jamdb/issues/3
        relationships.history = relationships.history || {'links': {}};
        relationships.history.links.related = 'http://localhost:1212/v1/id/documents/' + resourceHash.id + '/history';
        relationships.history.links.self = relationships.history.links.related;
        return relationships;
    },
});

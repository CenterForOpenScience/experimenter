import Ember from 'ember';

export default Ember.Route.extend({
    /**
     *
     * @param {String} collectionName Name of the collection to query
     * @param {Array} dest An array to be used for storing the combined results of all requests
     * @param {Number} page The current page number to fetch
     * @returns {Promise} A (chained) promise that will resolve to dest when all records have been fetched
     * @private
     */
    _fetchResults(collectionName, dest, page) {
        const options = {
            'filter[completed]': 1,
            'page[size]': 500,
            page: page
        };
        return this.store.query(collectionName, options).then(res => {
            const theseResults = res.toArray();
            dest.push(...theseResults);
            // TODO: This is an imperfect means of identifying the last page, but JamDB doesn't tell us directly
            if (theseResults.length !== 0 && dest.length < res.get('meta.total')) {
                return this._fetchResults(collectionName, dest, page + 1);
            } else {
                return dest;
            }
        });
    },

    model() {
        const collectionName = this.modelFor('experiments.info').get('sessionCollectionId');
        const results = Ember.A();
        return this._fetchResults(collectionName, results, 1);
    },

    setupController(controller) {
        // Small hack to reuse code
        const sanitizeProfileId = this.controllerFor('experiments.info.results').get('sanitizeProfileId');
        controller.set('sanitizeProfileId', sanitizeProfileId);

        return this._super(...arguments);
    }
});

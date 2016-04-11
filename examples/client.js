var request = require('request-promise');

var JAM_URL = 'http://localhost:1212';
var USERNAME = 'root';
var COLLECTION = 'sys';
var NAMESPACE = 'experimenter';

var ExperimenterClient = function(jamUrl, namespace) {
    this.jamUrl = jamUrl || JAM_URL;
    this.namespace = namespace || NAMESPACE;

    this.token = null;
};
ExperimenterClient.prototype.authorize = function(password) {
    var self = this;
    return request
        .post({
            json: true,
            url: `${this.jamUrl}/v1/auth`,
            body: {
                data: {
                    type: 'users',
                    attributes: {
                        provider: 'self',
                        password: password,
                        username: USERNAME,
                        namespace: this.namespace,
                        collection: COLLECTION
                    }
                }
            }
        })
        .then(function(response) {
            self.token = response.data.attributes.token;
            return self.token;
        });
};
ExperimenterClient.prototype.auth = function() {
    return {
        Authorization: this.token
    };
};

ExperimenterClient.prototype.getAll = function(url, page, accu) {
    var self = this;

    page = page || 1; //The current page of data to get
    accu = accu || []; //The accumulated value
    return request
        .get({
            url: url + '?limit=100&page=' + page,
            json: true,
            headers: self.auth()
        }).then(function(data) {
            //Unwrap data from JSON API and append it to our list
            accu = accu.concat(data.data);
            //If there are more documents to get increment the page and continue the loop
            if (data.meta.total > accu.length) {
                return self.getAll(url, page + 1, accu);
            }
            //No more pages, we can return all the collected documents
            return accu;
        });
};
ExperimenterClient.prototype.getExperiments = function() {
    //Experiments live in the collection experiments under the namespace experimenter
    //All documents, or experiments in this case, may be accessed at either
    // /v1/id/collections/experimenter.experiments/documents Or
    // /v1/namespaces/experimenter/collections/experiments/documents
    var url = this.jamUrl + ['/v1/id', 'collections', this.namespace + '.experiments', 'documents'].join('/');
    return this.getAll(url);
};
ExperimenterClient.prototype.experimentInfo = function(experimentId) {
    var self = this;
    return request
        .get({
            url: this.jamUrl + ['/v1/id', 'documents', experimentId].join('/'),
            json: true,
            headers: self.auth()
        }).then(function(data) {
            //Unwrap data from JSON API
            return data.data;
        });
};
ExperimenterClient.prototype.getExperimentSessions = function(experiment) {
    //Get a list of sessions for this experiment
    //Sessions live in a collection determined by their experiment under the namespace experimenter
    //All documents, or sessions in this case, may be accessed at either
    // /v1/id/collections/experimenter.session{experiment short id}s/documents Or
    // /v1/namespaces/experimenter/collections/session{experiment short id}s/documents
    var sessionId = this.namespace + '.session' + experiment.id.split('.').pop() + 's';
    var url = this.jamUrl + ['/v1/id', 'collections', sessionId, 'documents'].join('/');
    return this.getAll(url);
};
ExperimenterClient.prototype.getSessionInfo = function(sessionId) {
    var self = this;
    return request
        .get({
            url: this.jamUrl + ['/v1/id', 'documents', sessionId].join('/'),
            json: true,
            headers: self.auth()
        }).then(function(data) {
            //Unwrap data from JSON API
            return data.data;
        });
};
ExperimenterClient.prototype.setFeedback = function(sessionId, feedback) {
    //Using JamDB's jsonpatch feature we can update a single field
    //https://jamdb.readthedocs.org/en/latest/api.html#jsonpatch
    var self = this;
    return request.patch({
        method: 'PATCH',
        contentType: 'application/vnd.api+json; ext=jsonpatch',
        url: this.jamUrl + ['/v1/id', 'documents', sessionId].join('/'),
        data: {
            op: 'add',
            path: '/feedback',
            value: feedback
        },
        json: true,
        headers: self.auth()
    }).then(function(data) {
        return data.data;
    });
};

module.exports = ExperimenterClient;

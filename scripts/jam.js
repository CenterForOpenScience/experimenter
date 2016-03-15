var Promise = require('bluebird');
var request = require('request-promise');

var CONTENT_TYPE = 'application/vnd.api+json';
var PATCH_CONTENT_TYPE = 'application/vnd.api+json ext="jsonpatch";';

var USER_SCHEMA = {
    'type': 'jsonschema',
    'schema': {
        'id': '/',
        'type': 'object',
        'properties': {
            'password': {
                'id': 'password',
                'type': 'string',
                'pattern': '^\\$2b\\$1[0-3]\\$\\S{53}$'
            },
        },
        'required': ['password']
    }
};


function Collection(namespace, name) {
    var self = this;
    self._name = name;
    self._namespace = namespace;
    self._token = namespace._token;
    self._url = `${module.exports.JAM_URL}/v1/id/collections/${self._namespace._name}.${self._name}`;

    self.get = function(id) {
        return request.get({
            json: true,
            url: self._url + `/documents/${id}`,
            headers: {Authorization: self.token},
        });
    }

    self.create = function(id, attrs) {
        return request.post({
            json: true,
            url: self._url + '/documents',
            body: {data: {
                id: id,
                type: 'documents',
                attributes: attrs || {},
            }},
            headers: {
                Authorization: self._token,
                'Content-Type': CONTENT_TYPE
            },
        });
    }

    self.update = function(patchOrData) {
        if (!Array.isArray(patchOrData))
            patchOrData = {data: {id: self._name, attributes: patchOrData}}

        return request.patch({
            json: true,
            url: self._url,
            body: patchOrData,
            headers: {
                Authorization: self._token,
                'Content-Type': Array.isArray(patchOrData) ? PATCH_CONTENT_TYPE : CONTENT_TYPE
            },
        });
    }

    self.userify = function(createdIsOwner) {
        return self.update([{
            op: 'add', path: '/schema', value: USER_SCHEMA,
        }, {
            op: 'add', path: '/flags/userCollection', value: true,
        }, {
            op: 'add', path: '/flags/createdIsOwner', value: !createdIsOwner
        }]);
    }

    return request.get({
        json: true,
        url: self._url,
        headers: {Authorization: self._token},
    }).then(function() {return self;});
}


function Namespace(name, token) {
    var self = this;

    self._name = name;
    self._token = token;
    self._url = `${module.exports.JAM_URL}/v1/id/namespaces/${name}`;

    self.get = function(collection) {
        return new Collection(self, collection);
    };

    self.create = function(collection, attrs) {
        return request.post({
            json: true,
            url: self._url + '/collections',
            body: {data: {
                id: collection,
                type: 'collections',
                attributes: attrs || {},
            }},
            headers: {
                Authorization: self._token,
                'Content-Type': CONTENT_TYPE
            },
        }).then(_ => self.get(collection));
    }

    self.getOrCreate = function(collection, attrs) {
        return self
            .get(collection)
            .catch(e => self.create(collection, attrs));
    }

    self.update = function(patchOrData) {
        if (!Array.isArray(patchOrData))
            patchOrData = {data: {id: self._name, attributes: patchOrData}}

        return request.patch({
            json: true,
            url: self._url,
            body: patchOrData,
            headers: {
                Authorization: self._token,
                'Content-Type': Array.isArray(patchOrData) ? PATCH_CONTENT_TYPE : CONTENT_TYPE
            },
        });
    };

    self.list = function() {
        return request.get({
            json: true,
            url: self._url + '/collections',
            headers: {Authorization: self._token},
        }).then(data => data.data);
    }

    self.delete = function(name) {
        return request({
            method: 'DELETE',
            json: true,
            url: `${module.exports.JAM_URL}/v1/id/collections/${name}`,
            headers: {Authorization: self._token},
        });
    }

    return request.get({
        json: true,
        url: self._url,
        headers: {Authorization: self._token},
    }).then(function() {return self;});
}

module.exports = {
    JAM_URL: 'http://localhost:1212',
    Namespace: Namespace
};

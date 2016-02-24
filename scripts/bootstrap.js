var fs = require('fs');

var Promise = require('bluebird');
var request = require('request-promise');
var permissions = require('./permissions.js');
var gen_schemas = require('./generate_schemas.js');

gen_schemas();

var JAM_URL = 'http://localhost:1212';
var USERNAME = 'root';
var COLLECTION = 'sys';
var PASSWORD = 'password';
var NAMESPACE = 'experimenter';

function authorize() {
    return request
        .post({
            json: true,
            url: `${JAM_URL}/v1/auth`,
            body: {
                data: {
                    type: 'users',
                    attributes: {
                        provider: 'self',
                        password: PASSWORD,
                        username: USERNAME,
                        namespace: NAMESPACE,
                        collection: COLLECTION
                    }
                }
            }
        })
        .then(function(response) {
            return response.data.attributes.token;
        });
}

function getOrCreateCollection(collection, token) {
    return request
        .get({
            json: true,
            headers: {
                Authorization: token
            },
            url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}`
        })
        .catch(function(err) {
            return request.post({
                json: true,
                headers: {
                    Authorization: token
                },
                url: `${JAM_URL}/v1/id/namespaces/${NAMESPACE}/collections`,
                body: {
                    data: {
                        id: collection,
                        type: 'collections',
                        attributes: {}
                    }
                }
            });
        });
}

function updateCollection(collection, token, ops) {
    return request
        .patch({
            body: ops,
            json: true,
            headers: {
                Authorization: token,
                'Content-Type': 'application/vnd.api+json ext="jsonpatch";'
            },
            url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}`
        });
}

function loadExamples(collection, token, examples) {
    if (!Array.isArray(examples) || examples.length < 1)
        return console.log(`No example data for ${collection}`);

    return Promise.map(examples, function(example) {

        return request.post({
            // json: true,
            headers: {
                Authorization: token
            },
            url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}/documents`,
            body: JSON.stringify({
                data: {
                    id: example.id,
                    type: 'documents',
                    attributes: example
                }
            })
        }).then(function() {
            if (collection === 'experiments') {
                getOrCreateCollection(`session${example.id}s`, token);
            }
        }).catch(function(e) {
            console.log(e.error);
            console.log();
        });
    });
}

function bootstrapCollection(token, name) {
    var ops = [];

    try {
        ops.push({
            op: 'add',
            path: '/schema',
            value: require(`../schemas/${name}.json`)
        });
    } catch (e) {
        console.log(`No schema found for collection ${name}, skipping`);
    }

    var examples = null;
    try {
        examples = require(`./data/${name}.json`);
    } catch (e) {
        examples = [];
        console.log(`No example data for ${name}, because of error`, e);
    }

    if (Array.isArray(permissions[name]))
        ops = ops.concat(permissions[name].map(function(p) {
            console.log(`Granting ${p[0]} ${p[1]} permissions on collection ${name}`);
            return {
                op: 'add',
                path: `/permissions/${p[0]}`,
                value: p[1]
            };
        }));
    else
        console.log(`No permissions found for collection ${name}, skipping`);

    return getOrCreateCollection(name + 's', token)
        .then(updateCollection.bind(this, name + 's', token, ops))
        .then(loadExamples.bind(this, name + 's', token, examples));
}

function setNamespacePermissions(token) {
    var ops = [
        {
            op: 'add',
            path: '/permissions/user-osf-*',
            value: 'ADMIN'
        }
    ];
    return request
        .patch({
            body: ops,
            json: true,
            headers: {
                Authorization: token,
                'Content-Type': 'application/vnd.api+json ext="jsonpatch";'
            },
            url: `${JAM_URL}/v1/namespaces/${NAMESPACE}`
        });
}

var COLLECTIONS = fs.readdirSync(__dirname + '/data')
        .map(function(name) {
            return name.replace('.json', '');
        });

authorize()
    .then(function(token) {
        setNamespacePermissions(token).then(function() {
            return Promise.map(COLLECTIONS, bootstrapCollection.bind(this, token));
        });
    })
    .catch(function(err) {
        console.log(err.error);
    });

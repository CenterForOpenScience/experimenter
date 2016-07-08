/* jshint node: true */
var fs = require('fs');

var Promise = require('bluebird');
var request = require('request-promise');

var jam = require('./jam.js');
var permissions = require('./permissions.js');
var gen_schemas = require('./generate_schemas.js');

gen_schemas();

var JAM_URL = 'http://localhost:1212';
var USERNAME = 'root';
var COLLECTION = 'sys';
var PASSWORD = 'password';
var NAMESPACE = 'experimenter';

var ADMIN_OSF_IDS = [
    'x2zau', '7yrzb',  // Brian "The Food Geek" Geiger
    'x679r', 'beu32',  // Sam "The Banjo Man" Chrisinger
    '92jdq', // Lauren "Nickname to be determined" Barker
    '7bauz', // Andy Boughton
    'rkaye'  // Chris "Ostriches" Seto
];
try {
    ADMIN_OSF_IDS = ADMIN_OSF_IDS.concat(JSON.parse(fs.readFileSync(__dirname + '/admins.json')));
}
catch (e) {
    console.log(e);
}

function authorize(password) {
    return request
        .post({
            json: true,
            url: `${JAM_URL}/v1/auth`,
            body: {
                data: {
                    type: 'users',
                    attributes: {
                        provider: 'self',
                        password: password,
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

function loadExamples(collection, examples) {
    if (!Array.isArray(examples) || examples.length < 1) {
        return console.log(`No example data for ${collection}`);
    }

    return Promise.map(examples, function(example) {
        return collection.create(example.id, example)
            .then(_ => {
                if (collection._name === 'experiments')
                    return collection._namespace.getOrCreate(`session${example.id}s`)
                        .then(col => col.update([{
                            op: 'add', path: '/permissions/jam-experimenter:accounts-*', value: 'CREATE'
                        }]));
            }).catch(e => {
                if (e.statusCode === 409) return;
                console.log(e.error);
                console.log();
            });
    });
}

function bootstrapCollection(namespace, name) {
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

    if (Array.isArray(permissions[name])) {
        ops = ops.concat(permissions[name].map(function(p) {
            console.log(`Granting ${p[0]} ${p[1]} permissions on collection ${name}`);
            return {
                op: 'add',
                path: `/permissions/${p[0]}`,
                value: p[1]
            };
        }));
    } else {
        console.log(`No permissions found for collection ${name}, skipping`);
    }

    return namespace.getOrCreate(name + 's')
        .then(collection => collection.update(ops)
            .then(loadExamples.bind(this, collection, examples)));
}


var COLLECTIONS = fs.readdirSync(__dirname + '/data').map(name => name.replace('.json', ''));

var argv = require('yargs').argv;
jam.JAM_URL = argv.jam || JAM_URL;

if (argv.clear) {
    authorize(argv.password || PASSWORD)
        .then(token => new jam.Namespace(NAMESPACE, token))
        .then(namespace => {
            return namespace.list()
            .then(collections => Promise.map(
                collections.map(col => col.id),
                namespace.delete
            ))
        })
        .catch(err => console.log(err.error || err));
} else {
    authorize(argv.password || PASSWORD)
        .then(token => new jam.Namespace(NAMESPACE, token))
        .then(namespace => {
            return namespace
                .update(ADMIN_OSF_IDS.map(id => ({
                    op: 'add', value: 'ADMIN', path: `/permissions/user-osf-${id}`,
                }))).then(_ => namespace.getOrCreate('accounts'))
                .then(collection => collection.userify())
                .then(_ => namespace.getOrCreate('thumbnails', {
                    state: 'mongo',
                    permissions: {'*': 'READ'}
                }))
                .then(_ => Promise.map(COLLECTIONS, bootstrapCollection.bind(this, namespace)))
        })
        .catch(err => console.log(err.error || err));
}

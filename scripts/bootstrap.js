var fs = require('fs');
var Promise = require('bluebird');
var request = require('request-promise');
var permissions = require('./permissions.js');

var JAM_URL = 'http://localhost:1212'
var USERNAME = 'admin';
var COLLECTION = 'users';
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
            collection: COLLECTION,
          }
        }
      }
    })
    .then(function(response) {
      return response.data.attributes.token;
    })
}

function getOrCreateCollection(collection, token) {
  return request
    .get({
      json: true,
      headers: {Authorization: token},
      url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}`
    })
    .catch(function(err) {
      return request.post({
        json: true,
        headers: {Authorization: token},
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
        url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}`,
    })
}

function loadExamples(collection, token, examples) {
  if (!Array.isArray(examples) || examples.length < 1)
    return console.log(`No example data for ${collection}`);

  return Promise.map(examples, function(example) {

    return request.post({
      // json: true,
      headers: {Authorization: token},
      url: `${JAM_URL}/v1/id/collections/${NAMESPACE}.${collection}/documents`,
      body: JSON.stringify({
        data: {
          id: example.id,
          type: 'documents',
          attributes: example
        }
      })
    }).catch(function(e){
      console.log(e.error);
      console.log();
    });
  });
}

function bootstrapCollection(token, name) {
  var ops = [];

  try {
    ops.push({op: 'add', path: '/schema', value: require(`./schemas/${name}.json`)});
  } catch(e) {
    console.log(`No schema found for collection ${name}, skipping`);
  }

  try {
    var examples = require(`${__dirname}/data/${name}.json`);
  } catch(e) {
    var examples = [];
    console.log(`No example data for ${name}`);
  }

  if (Array.isArray(permissions[name]))
    ops = ops.concat(permissions[name].map(function(p) {
      console.log(`Granting ${p[0]} ${p[1]} permissions on collection ${name}`);
      return {op: 'add', path: `/permissions/${p[0]}`, value: p[1]};
    }))
  else
    console.log('No permissions found for collection ${name}, skipping');

  return getOrCreateCollection(name + 's', token)
    .then(updateCollection.bind(this, name + 's', token, ops))
    .then(loadExamples.bind(this, name + 's', token, examples))
}

COLLECTIONS = ['admin'].concat(fs
    .readdirSync(__dirname + '/data')
    .map(function(name) {
      return name.replace('.json', '');
    }))

//NOTE: this script assumes the following commands have already been run
//jam create experimenter
//jam create experimenter users
//jam update experimenter -p "jam-experimenter:users-admin"
//echo '{"password":"$2b$12$iujjM4DtPMWVL1B2roWjBeHzjzxaNEP8HbXxdZwRha/j5Pc8E1n2G"}' | jam create experimenter users admin

authorize()
  .then(function(token) {
    return Promise.map(COLLECTIONS, bootstrapCollection.bind(this, token));
  })
  .catch(function(err) {
    console.log(err);
  });

/* jshint node: true */
require('dotenv').config();

module.exports = function(environment) {
    var ENV = {
        OSF: {
            clientId: process.env.OSF_CLIENT_ID,
            scope: process.env.OSF_SCOPE,
            url: process.env.OSF_URL,
            authUrl: process.env.OSF_AUTH_URL
        },
        modulePrefix: 'experimenter',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },
        'ember-simple-auth': {
            authenticationRoute: 'login'
        },
        APP: {}
    };

    if (environment === 'development') {
        ENV.JAMDB = {
            url: process.env.JAMDB_URL || 'http://localhost:1212',
            namespace: process.env.JAMDB_NAMESPACE,
            authorizer: 'osf-jwt'
        };
    } else if (environment === 'staging' || environment === 'production') {
        ENV.JAMDB = {
            url: process.env.JAMDB_URL,
            namespace: process.env.JAMDB_NAMESPACE,
            authorizer: 'osf-jwt'
        };
    } else if (environment === 'test') {
        ENV.JAMDB = {
            url: '',
            namespace: 'test',
            authorizer: 'osf-jwt'
        };

        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    return ENV;
};

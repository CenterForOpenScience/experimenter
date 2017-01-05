/*jshint node:true*/
/* global require, module */
require('dotenv').config();

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const transpiler = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    const workerDestDir = '/assets/workers';

    const workers = transpiler(
            new Funnel('app/workers', {
            include: ['*.js'],
            destDir: workerDestDir
        })
    );

    const workerDeps = new Funnel('bower_components', {
        include: ['bcryptjs/dist/bcrypt.min.js'],
        destDir: workerDestDir
    });

    const app = new EmberApp(defaults, {
        sourcemaps: {
            enabled: true
        },
        minifyJS: {
            enabled: EmberApp.env() === 'production'
        },
        minifyCSS: {
            enabled: EmberApp.env() === 'production'
        },
        sassOptions: {
            includePaths: [
                'app/styles'
            ]
        },
        emberWowza: {
            // Config for video recorder config
            asp: JSON.parse(process.env.WOWZA_ASP),
            // Config for actual video recording
            php: JSON.parse(process.env.WOWZA_PHP)
        },
        'ember-bootstrap': {
            importBootstrapFont: false
        },
        babel: {
            optional: ['es6.spec.symbols'],
            includePolyfill: true
        },
    });

    app.import('bower_components/ace-builds/src/ace.js');
    app.import('bower_components/ace-builds/src/mode-json.js');
    app.import('bower_components/ace-builds/src/ext-beautify.js');

    app.import('bower_components/moment/moment.js');
    app.import('bower_components/file-saver.js/FileSaver.js');

    app.import('bower_components/font-awesome/css/font-awesome.css');
    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.eot', {
        destDir: 'fonts'
    });
    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.svg', {
        destDir: 'fonts'
    });
    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', {
        destDir: 'fonts'
    });
    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', {
        destDir: 'fonts'
    });
    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff2', {
        destDir: 'fonts'
    });
    app.import('bower_components/font-awesome/fonts/FontAwesome.otf', {
        destDir: 'fonts'
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    return new BroccoliMergeTrees([
        app.toTree(),
        workers,
        workerDeps
    ]);
};

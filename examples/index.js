var argv = require('yargs').argv;
var ExperimenterClient = require('./client');

if (!argv.password) {
    console.log('You must run this script with the --password=<password> flag, e.g.:');
    console.log('node index.js --password=password');
} else {
    var client = new ExperimenterClient('https://staging-metadata.osf.io');
    client
        .authorize(argv.password)
        .then(function() {
	    return client.getExperiments();
        })
        .then(function(experiments) {
            experiments.forEach(function(experiment) {
                client.getExperimentSessions(experiment)
                    .then(function(sessions) {
                        console.log(
                            [
                                'Sessions for: ',
                                experiment.attributes.title,
                                ' (',
                                experiment.id,
                                ')'
                            ].join('')
                        );
                        console.log(JSON.stringify(sessions, null, 2));
                        console.log('--------------------------------');
                    });
            });
        });
}

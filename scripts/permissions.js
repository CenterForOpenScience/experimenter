// TODO make user specific
var OSF = 'user-osf-*';
var PARTICIPANT = 'jam-experimenter:accounts-*';
var GLOBAL = '*';

var config = [
    [OSF, 'CRUD']
];

var admin = [
    [OSF, 'READ'],
    [OSF, 'CREATE']
];

var experiment = [
    [GLOBAL, 'READ'],
    [OSF, 'CREATE']
];

var session = [
    [PARTICIPANT, 'CREATE'],
    [OSF, 'READ']
];

var account = [
    [GLOBAL, 'CREATE'],
    [OSF, 'READ']
];

var profile = [
    [PARTICIPANT, 'CREATE'],
    [OSF, 'READ']
];

var thumbnail = [
    [PARTICIPANT, 'READ'],
    [OSF, 'CREATE']
];

module.exports = {
    account: account,
    admin: admin,
    config: config,
    experiment: experiment,
    profile: profile,
    thumbnail: thumbnail
    // session: session
};

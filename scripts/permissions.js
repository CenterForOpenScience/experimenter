// TODO make user specific
var OSF = 'user-osf-*';

var ADMIN = 'jam-experimenter:admins-*';
var PARTICIPANT = 'jam-experimenter:accounts-*';

var config = [
    [ADMIN, 'CRUD'],
    [OSF, 'CRUD']
];

var admin = [
    [ADMIN, 'READ'],
    [OSF, 'READ'],
    [ADMIN, 'CREATE'],
    [OSF, 'CREATE']
];

var experiment = [
    [ADMIN, 'READ'],
    [OSF, 'READ'],
    [ADMIN, 'CREATE'],
    [OSF, 'CREATE'],
    [PARTICIPANT, 'READ']
];

var session = [
    [PARTICIPANT, 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
];

var account = [
    ['*', 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
];

var profile = [
    [PARTICIPANT, 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
];

module.exports = {
    account: account,
    admin: admin,
    config: config,
    experiment: experiment,
    profile: profile
    // session: session
};

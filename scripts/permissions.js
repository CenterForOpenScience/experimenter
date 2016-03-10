// TODO make user specific
var PARTICIPANT = 'jam-experimenter:accounts-*';
var GLOBAL = '*';

var config = [
];

var experiment = [
    [GLOBAL, 'READ'],
];

var session = [
    [PARTICIPANT, 'CREATE'],
    [PARTICIPANT, 'UPDATE'],
];

var account = [
    [GLOBAL, 'CREATE'],
];

var profile = [
    [PARTICIPANT, 'CREATE'],
];

var thumbnail = [
    [PARTICIPANT, 'READ'],
];

module.exports = {
    account: account,
    //config: config,
    experiment: experiment,
    profile: profile,
    thumbnail: thumbnail,
    session: session
};

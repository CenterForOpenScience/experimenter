// TODO make user specific
OSF = 'user-osf-*'
ADMIN = 'jam-experimenter:admins-*'
PARTICIPANT = 'jam-experimenter:accounts-*'

config = [
    [ADMIN, 'CRUD'],
    [OSF, 'CRUD'],
]

admin = [
    [ADMIN, 'READ'],
    [OSF, 'READ'],
    [ADMIN, 'CREATE'],
    [OSF, 'CREATE']
]

experiment = [
    [ADMIN, 'READ'],
    [OSF, 'READ'],
    [ADMIN, 'CREATE'],
    [OSF, 'CREATE'],
    [PARTICIPANT, 'READ']
]

session = [
    [PARTICIPANT, 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
]

account = [
    [ADMIN, 'CREATE'],
    [OSF, 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
]

profile = [
    [PARTICIPANT, 'CREATE'],
    [ADMIN, 'READ'],
    [OSF, 'READ']
]

module.exports = {
  account: account,
  admin: admin,
  config: config,
  experiment: experiment,
  profile: profile,
  session: session,
}

from jam.auth import Permissions

# TODO make user specific
OSF = 'user-osf-*'

ADMIN = 'tracked-experimenter|admins-*'
PARTICIPANT = 'tracked-experimenter|accounts-*'

config = [
    (ADMIN, Permissions.CRUD),
    (OSF, Permissions.CRUD)
]

admin = [
    (ADMIN, Permissions.READ),
    (OSF, Permissions.READ),
    (ADMIN, Permissions.CREATE),
    (OSF, Permissions.CREATE)
]

experiment = [
    (ADMIN, Permissions.READ),
    (OSF, Permissions.READ),
    (ADMIN, Permissions.CREATE),
    (OSF, Permissions.CREATE),
    (PARTICIPANT, Permissions.READ)
]

session = [
    (PARTICIPANT, Permissions.CREATE),
    (ADMIN, Permissions.READ),
    (OSF, Permissions.READ)
]

account = [
    (ADMIN, Permissions.CREATE),
    (OSF, Permissions.CREATE),
    (ADMIN, Permissions.READ),
    (OSF, Permissions.READ)
]

profile = [
    (PARTICIPANT, Permissions.CREATE),
    (ADMIN, Permissions.READ),
    (OSF, Permissions.READ)
]

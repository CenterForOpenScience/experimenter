from jam.auth import Permissions

ADMIN = 'tracked-experimenter|admins-*'
PARTICIPANT = 'tracked-experimenter|accounts-*'

config = [
    (ADMIN, Permissions.CRUD)
]

admin = [
    (ADMIN, Permissions.READ),
    (ADMIN, Permissions.CREATE)
]

experiment = [
    (ADMIN, Permissions.READ),
    (ADMIN, Permissions.CREATE),
    (PARTICIPANT, Permissions.READ)
]

session = [
    (PARTICIPANT, Permissions.CREATE),
    (ADMIN, Permissions.READ)
]

account = [
    (ADMIN, Permissions.CREATE),
    (ADMIN, Permissions.READ)
]

profile = [
    (PARTICIPANT, Permissions.CREATE),
    (ADMIN, Permissions.READ)
]

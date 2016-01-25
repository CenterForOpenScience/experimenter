import json

import jam
import jam.auth

NS = 'experimenter'
USER = 'tracked-OPENTRIALS|users-scrapi'

USERNAME = 'root@foo.io'

nsm = jam.NamespaceManager()

try:
    exp_ns = nsm.create_namespace(NS, USER)
except jam.exceptions.KeyExists:
    exp_ns = nsm.get_namespace(NS)

try:
    users_col = exp_ns.create_collection('admins', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('admins')

admin_schema = json.load(open('./schemas/admin.json', 'r'))
exp_ns.update('admins', [{'op': 'add', 'path': '/schema', 'value': admin_schema}], 'system')

try:
    users_col.create(
        'root', {
            'username': USERNAME,
            'password': '$2b$12$iujjM4DtPMWVL1B2roWjBeHzjzxaNEP8HbXxdZwRha/j5Pc8E1n2G',
            'firstName': 'Victor',
            'lastName': 'Frankenstein'
        }, ''
    )
except jam.exceptions.KeyExists:
    print('\nUser {user} already exists in the users collection'.format(user=USERNAME))

try:
    nsm.update('experimenter', [
        {
            'op': 'add', 'path': '/permissions/tracked-experimenter|admins-root', 'value': jam.auth.Permissions.ADMIN
        }
    ], USER)
except jam.exceptions.MalformedData:
    pass

try:
    nsm.update('experimenter', [
        {
            'op': 'remove', 'path': '/permissions/{0}'.format(USER)
        }
    ], USER)
except Exception:
    pass


try:
    users_col = exp_ns.create_collection('accounts', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('accounts')

try:
    users_col = exp_ns.create_collection('configs', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('configs')

try:
    users_col = exp_ns.create_collection('experiments', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('experiments')

try:
    users_col = exp_ns.create_collection('sessions', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('sessions')

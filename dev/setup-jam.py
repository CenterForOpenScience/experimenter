from glob import glob
import json
import os

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


for sample in glob('./dev/data/*.json'):
    col_name = os.path.basename(sample).split('.json')[0]

    try:
        schema = json.load(open('./schmeas/{}.json'.format('col_name'), 'r'))
    except OSError:
        pass
    else:
        exp_ns.update(col_name, [{'op': 'add', 'path': '/schema', 'value': admin_schema}], 'system')

    try:
        sample_data = json.load(open(sample, 'r'))
    except json.decoder.JSONDecodeError as e:
        print("Error loading sample data for {}".format(col_name))
        raise

    try:
        col = exp_ns.get_collection(col_name)
    except jam.exceptions.NotFound:
        col = exp_ns.create_collection(col_name, 'system')

    for record in sample_data:
        try:
            col.create(col_name, record, 'system')
        except jam.exceptions.KeyExists:
            pass

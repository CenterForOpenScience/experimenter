from glob import glob
import json
import os
import bson

import jam
import jam.auth

import permissions


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
    ], 'system')
except jam.exceptions.MalformedData:
    pass

try:
    nsm.update('experimenter', [
        {
            'op': 'remove', 'path': '/permissions/{0}'.format(USER)
        }
    ], 'system')
except Exception:
    pass


for sample in glob('./dev/data/*.json'):
    col_name = os.path.basename(sample).split('.json')[0]

    try:
        col = exp_ns.get_collection(col_name)
    except jam.exceptions.NotFound:
        col = exp_ns.create_collection(col_name, 'system')

    try:
        schema = json.load(open('./schemas/{}.json'.format(col_name), 'r'))
    except OSError:
        print("No schema file found for {}, skipping".format(col_name))
    else:
        exp_ns.update(col_name, [{'op': 'add', 'path': '/schema', 'value': schema}], 'system')

    try:
        col_permissions = getattr(permissions, col_name)
    except AttributeError as e:
        print("No permissions found for collection {}, skipping".format(col_name))
        pass
    else:
        for pair in col_permissions:
            print("Granting {} {} permissions on collection {}".format(pair[0], pair[1], col_name))
            exp_ns.update(col_name, [
                {
                    'op': 'add', 'path': '/permissions/{0}'.format(pair[0]), 'value': pair[1]
                }
            ], 'system')

    try:
        sample_data = json.load(open(sample, 'r'))
    except json.decoder.JSONDecodeError as e:
        print("Error loading sample data for {}".format(col_name))
        raise

    n_records = 0
    for record in sample_data:
        try:
            col.create(record.get(
                'id',
                str(bson.ObjectId())
            ), record, 'system')
        except jam.exceptions.KeyExists:
            pass
        else:
            n_records += 1
    print("Created {} sample records in the {} collection".format(n_records, col_name))

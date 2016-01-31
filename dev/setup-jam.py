from glob import glob
import json
import os
import bson

import jam
import jam.auth

import permissions


NS = 'experimenter'
USER = 'tracked-experimenter|admin-root'

USERNAME = 'root'

nsm = jam.NamespaceManager()

try:
    exp_ns = nsm.create_namespace(NS, USER)
except jam.exceptions.KeyExists:
    exp_ns = nsm.get_namespace(NS)

try:
    users_col = exp_ns.create_collection('admins', USER)
except jam.exceptions.KeyExists:
    users_col = exp_ns.get_collection('admins')

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


for sample in glob('./dev/data/*.json'):
    col_name = os.path.basename(sample).split('.json')[0] + 's'

    try:
        col = exp_ns.get_collection(col_name)
    except jam.exceptions.NotFound:
        col = exp_ns.create_collection(col_name, user=USER)

    try:
        schema = json.load(open('./schemas/{}.json'.format(col_name.rstrip('s')), 'r'))
    except OSError:
        print("No schema file found for {}, skipping".format(col_name))
    else:
        exp_ns.update(col_name, [{'op': 'add', 'path': '/schema', 'value': schema}], USER)

    try:
        col_permissions = getattr(permissions, col_name.rstrip('s'))
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
            ], '*')

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
            ), record, '*')
        except jam.exceptions.KeyExists:
            pass
        else:
            n_records += 1
    print("Created {} sample records in the {} collection".format(n_records, col_name))

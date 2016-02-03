from glob import glob
import json
import os
import bson

import jam
import jam.auth

import permissions

# Regenerate json-schemas
import generate_schemas  # noqa


NS = 'experimenter'
USER = 'jam-experimenter:admins-root'

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
            ], USER)

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
            ), record, USER)
        except jam.exceptions.KeyExists:
            pass
        else:
            n_records += 1
    print("Created {} sample records in the {} collection".format(n_records, col_name[:-1]))

nsm.update(NS, [
    {
        'op': 'add', 'path': '/permissions/user-osf-*', 'value': 'ADMIN'
    }
], USER)
nsm.update(NS, [
    {
        'op': 'add', 'path': '/permissions/jam-experimenter:admins-*', 'value': 'ADMIN'
    }
], USER)

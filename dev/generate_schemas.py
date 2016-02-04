import json
import os

# h/t: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s07.html
ISO_DATE_PATTERN = r'^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$'

USERNAME_PATTERN = r'^(\*|[^\s\-\*]+\-\*|[^\s\-\*]+\-[^\s\-\*]+\-\*|[^\s\-\*]+\-[^\s\-\*]+\-[^\s\-\*]+)$'

JAM_ID_PATTERN = r'[\w]+\.[\w]+\.[\w]+'

ADMIN = {
    "type": "jsonschema",
    "schema": {
        "id": "admin",
        "type": "object",
        "properties": {
            "id": {
                "id": "id",
                "type": "string"
            },
            "username": {
                "id": "username",
                "type": "string"
            },
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\$2b\$1[0-3]\$\S{53}$"
            },
            "firstName": {
                "id": "firstName",
                "type": "string",
                "pattern": "^(?:[\w\.]){3,60}"
            },
            "lastName": {
                "id": "lastName",
                "type": "string",
                "pattern": "^(?:[\w\.]){3,60}"
            },
            "experiments": {
                "id": "experiments",
                "type": "array",
                "items": {
                    "type": "string",
                    "pattern": JAM_ID_PATTERN
                },
                "uniqueItems": True
            }
        },
        "required": [
            "username",
            "password"
        ],
        "additionalProperties": False
    }
}

# default profile schema
PROFILE = {
    "type": "jsonschema",
    "schema": {
        "id": "profile",
        "type": "object",
        "properties": {
            "firstName": {
                "id": "firstName",
                "type": "string",
                "pattern": "^\w{3,64}",
            },
            "lastName": {
                "id": "lastName",
                "type": "string",
                "pattern": "^\w{3,64}",
            },
            "birthday": {
                "id": "birthday",
                "type": "string",
                "pattern": ISO_DATE_PATTERN
            },
            "account": {
                "id": "account",
                "type": "string",
                "pattern": JAM_ID_PATTERN
            },
            "sessions": {
                "id": "sessions",
                "type": "array",
                "items": {
                    "type": "string",
                    "pattern": JAM_ID_PATTERN,
                },
                "uniqueItems": True
            }
        },
        "required": [
            "firstName", "lastName", "birthday", "account"
        ],
        # "additionalProperties": False  // todo: re-enable
    }
}

CONFIG = {
    "type": "jsonschema",
    "schema": {
        "id": "config",
        "type": "object",
        "properties": {
            "profileSchema": {
                "id": "profileSchema",
                "type": "object"
            },
            "profilesMin": {
                "id": "profilesMin",
                "type": "integer"
            },
            "profilesMax": {
                "id": "profilesMin",
                "type": "integer"
            }
        },
        "additionalProperties": True
    }
}

EXPERIMENT = {
    "type": "jsonschema",
    "schema": {
        "id": "experiment",
        "type": "object",
        "properties": {
            "structure": {
                "id": "structure",
                "type": "array",
                "items": {
                    "type": "object"
                }
            },
            "title": {
                "id": "title",
                "type": "string"
            },
            "description": {
                "id": "description",
                "type": "string"
            },
            "active": {
                "id": "active",
                "type": "boolean"
            },
            "eligibilityCriteria": {
                "id": "eligibilityCriteria",
                "type": "object"
            }
        },
        "required": [
            "structure",
            "active"
        ],
        # "additionalProperties": False // TODO re-enable
    }
}

SESSION = {
    "type": "jsonschema",
    "schema": {
        "id": "session",
        "type": "object",
        "properties": {
            "profileId": {
                "id": "profileId",
                "type": "string"
            },
            "profileVersion": {
                "id": "profileVersion",
                "type": "string"
            },
            "experimentId": {
                "id": "experimentId",
                "type": "string"
            },
            "experimentVersion": {
                "id": "experimentVersion",
                "type": "string"
            },
            "parameters": {
                "id": "parameters",
                "type": "object"
            },
            "softwareVersion": {
                "id": "softwareVersion",
                "type": "string"  # TODO pattern? semver?
            },
            "data": {
                "id": "data",
                "type": "object"
            },
            "timestamp": {
                "id": "timestamp",
                "type": "string",
                "pattern": ISO_DATE_PATTERN
            }
        },
        "required": [
            "profileId", "profileVersion",
            "experimentId", "experimentVersion",
            "parameters", "softwareVersion",
            "data", "timestamp"
        ],
        "additionalProperties": False
    }
}

ACCOUNT = {
    "type": "jsonschema",
    "schema": {
        "id": "account",
        "type": "object",
        "properties": {
            "username": {  # TODO can this be an id?
                "id": "username",
                "type": "string",
                # "pattern": commonregex.email.pattern
            },
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\$2b\$1[0-3]\$\S{53}$"
            },
        },
        "required": [
            "password"
        ],
        # "additionalProperties": False
    }
}

for schema in (ADMIN, CONFIG, EXPERIMENT, SESSION, ACCOUNT, PROFILE):
    with open('{}/../schemas/{}.json'.format(os.path.dirname(__file__), schema['schema']['id']), 'w') as fp:
        print('Made schema for {}'.format(schema['schema']['id']))
        json.dump(schema, fp, indent=4, sort_keys=True)

import commonregex
import json
import os

ISO_DATE_PATTERN = "^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$"  # h/t http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/

ADMIN = {
    "type": "jsonschema",
    "schema": {
        "id": "admin",
        "type": "object",
        "properties": {
            "username": {
                "id": "username",
                "type": "string",
                "pattern": commonregex.email.pattern
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
                    "type": "string"
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
            }
        },
        "required": [
            "firstName", "lastName", "birthday"
        ],
        "additionalProperties": False
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
                "type": "object"
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
        "additionalProperties": False
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
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\$2b\$1[0-3]\$\S{53}$"
            },
            "profiles": {
                "id": "profiles",
                "type": "array",
                "items": {
                    "type": "string"
                },
                "uniqueItems": True
            },
            "sessions": {
                "id": "sessions",
                "type": "array",
                "items": {
                    "type": "string"
                },
                "uniqueItems": True
            }
        },
        "required": [
            "password"
        ],
        "additionalProperties": False
    }
}

for schema in (ADMIN, CONFIG, EXPERIMENT, SESSION, ACCOUNT):
    with open('./{}/{}.json'.format(os.path.dirname(__file__), schema['schema']['id']), 'w') as fp:
        json.dump(schema, fp, indent=4, sort_keys=True)

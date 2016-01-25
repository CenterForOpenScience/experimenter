import commonregex
import json
import os

USER = {
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
            "first_name": {
                "id": "email",
                "type": "string",
                "pattern": "^(?:[\w\.]){3,60}"
            },
            "last_name": {
                "id": "email",
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


for schema in (USER, ):
    with open('./{}/{}.json'.format(os.path.dirname(__file__), schema['schema']['id']), 'w') as fp:
        json.dump(schema, fp, indent=4, sort_keys=True)

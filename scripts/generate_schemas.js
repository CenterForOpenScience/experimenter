var path = require('path');
var fs = require('fs');

// h/t: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s07.html
var ISO_DATE_PATTERN = '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$';

var USERNAME_PATTERN = '^(\*|[^\s\-\*]+\-\*|[^\s\-\*]+\-[^\s\-\*]+\-\*|[^\s\-\*]+\-[^\s\-\*]+\-[^\s\-\*]+)$';

var JAM_ID_PATTERN = '[\w]+\.[\w]+\.[\w]+';

var ADMIN = {
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
                "uniqueItems": true
            }
        },
        "required": [
            "username",
            "password"
        ],
        "additionalProperties": false
    }
};

// default profile schema
var PROFILE = {
    "type": "jsonschema",
    "schema": {
        "id": "profile",
        "type": "object",
        "properties": {
            "firstName": {
                "id": "firstName",
                "type": "string",
                "pattern": "^\w{3,64}"
            },
            "lastName": {
                "id": "lastName",
                "type": "string",
                "pattern": "^\w{3,64}"
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
        },
        "required": [
            "firstName", "lastName", "birthday", "account"
        ]
        // "additionalProperties": false  // todo: re-enable
    }
};

var CONFIG = {
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
        "additionalProperties": true
    }
};

var EXPERIMENT = {
    "type": "jsonschema",
    "schema": {
        "id": "experiment",
        "type": "object",
        "properties": {
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
            "beginDate": {
                "id": "beginDate",
                "format": "date-time",
                "type": "string"
            },
            "endDate": {
                "id": "endDate",
                "format": "date-time",
                "type": "string"
            },
            "lastEdited": {
                "id": "lastEdited",
                "format": "date-time",
                "type": "string"
            },
            "structure": {
                "id": "structure",
                "type": "array",
                "items": {
                    "type": "object"
                }
            },
            "eligibilityCriteria": {
                "id": "eligibilityCriteria",
                "type": "object"
            }
        },
        "required": [
            "structure",
            "active"
        ]
        // "additionalProperties": false // TODO re-enable
    }
};

var SESSION = {
    "type": "jsonschema",
    "schema": {
        "id": "session",
        "type": "object",
        "properties": {
            "profile": {
                "id": "profile",
                "type": "string"
            },
            "profileVersion": {
                "id": "profileVersion",
                "type": "string"
            },
            "experiment": {
                "id": "experiment",
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
                "type": "string"  // TODO pattern? semver?
            },
            "expData": {
                "id": "expData",
                "type": "object"
            },
            "timestamp": {
                "id": "timestamp",
                "type": "string",
                "pattern": ISO_DATE_PATTERN
            }
        },
        "required": [
            "profile", "profileVersion",
            "experiment", "experimentVersion",
            "parameters", "softwareVersion",
            "expData", "timestamp"
        ],
        "additionalProperties": false
    }
};

var ACCOUNT = {
    "type": "jsonschema",
    "schema": {
        "id": "account",
        "type": "object",
        "properties": {
            "username": {  // TODO can this be an id?
                "id": "username",
                "type": "string"
                // # "pattern": commonregex.email.pattern
            },
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\$2b\$1[0-3]\$\S{53}$"
            }
        },
        "required": [
            "password"
        ]
        // "additionalProperties": false
    }
};

module.exports = function main() {
    [ADMIN, CONFIG, EXPERIMENT, SESSION, ACCOUNT, PROFILE].forEach(function(schema) {
        var schemaData = JSON.stringify(schema, null, 4);
        var base = path.dirname(__filename);
        var filename = schema.schema.id;
        fs.writeFile(`${base}/../schemas/${filename}.json`, schemaData);
    });
};

/* globals require */
/* jshint quotmark: true */


var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');

// h/t: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s07.html
var ISO_DATE_PATTERN = '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$';

// var URL_PATTERN = '(http|https)://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?';

var JAM_ID_PATTERN = '\\w+';
var PROFILE_ID_PATTERN = '\\w+\\.\\w+';


var CONFIG = {
    "schema": {
        "id": "config",
        "type": "object",
        "properties": {
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
    },
    "type": "jsonschema"
};

var EXPERIMENT = {
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
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "state": {
                "id": "state",
                "type": "string",
                "enum": [
                    "Draft",
                    "Active",
                    "Archived",
                    "Deleted"
                ]
            },
            "beginDate": {
                "id": "beginDate",
                "format": "date-time",
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "endDate": {
                "id": "endDate",
                "format": "date-time",
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "structure": {
                "id": "structure",
                "type": "object",
                "properties": {
                    "frames": {
                        "type": "object"
                    },
                    "sequence": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "eligibilityCriteria": {
                "id": "eligibilityCriteria",
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "displayFullscreen": {
                "type": "boolean",
                "default": false
            },
            "exitUrl": {
                "type": "string",
                "default": "/"
            },
            "duration": {
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "purpose": {
                "$oneOf": [
                    "string",
                    null
                ]
            }
        },
        "required": [
            "structure",
            "state"
        ]
    },
    "type": "jsonschema"
};


var SESSION = {
    "schema": {
        "id": "sessiontest0",  // Script creates one particular session collection associated with one single experiment
        "type": "object",
        "properties": {
            "completed": {
                "type": "boolean"
            },
            "profileId": {
                "type": "string",
                "pattern": PROFILE_ID_PATTERN
            },
            "experimentId": {  // TODO: In the new collection-per-experiment sessions model, this field may be redundant
                "type": "string",
                "pattern": JAM_ID_PATTERN
            },
            "experimentVersion": {
                "type": "string"
            },
            "sequence": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "expData": {
                "type": "object"
            },
            "feedback": {
                "$oneOf": [{
                    "type": "string"
                }, null]
            },
            "hasReadFeedback": {
                "$oneOf": [{
                    "type": "boolean"
                }, null]
            },
            "earlyExit": {
                "$oneOf": [{
                    "type": "object"
                }, null],
                "properties": {
                    "reason": {
                        "$oneOf": [{
                            "type": "string"
                        }, null]

                    },
                    "privacy": {
                        "type": "string"
                    }
                }
            }
        },
        "required": [
            "profileId",
            "experimentId",
            "experimentVersion",
            "completed",
            "sequence",
            "expData"
        ]
        // "additionalProperties": false
    },
    "type": "jsonschema"
};

var ACCOUNT = {
    "schema": {
        "id": "account",
        "type": "object",
        "properties": {
            "username": {  // TODO can this be an id?
                "type": "string"
                // # "pattern": commonregex.email.pattern
            },
            "name": {
                "$oneOf": [
                    "string",
                    null
                ]
            },
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\\$2b\\$1[0-3]\\$\\S{53}$"
            },
            "profiles": {
                "type": "array",  // Could also do this as an object, as long as keys were guaranteed unique
                "items": {
                    "type": "object",
                    "properties": {
                        "profileId": {
                            "type": "string",
                            "pattern": PROFILE_ID_PATTERN
                        },
                        "firstName": {
                            "type": "string",
                            "pattern": "^\\w{3,64}"
                        },
                        "birthday": {
                            "type": "string",
                            "pattern": ISO_DATE_PATTERN
                        },
                        "deleted": {
                            "type": "boolean",
                            "default": false
                        }
                    },
                    "required": ["firstName", "birthday"]
                }
            }
        },
        "required": ["username", "password"]
        // "additionalProperties": false
    },
    "type": "jsonschema"
};

// TODO RE-add account
module.exports = function main() {
    var base = path.dirname(__filename);
    rimraf.sync(`${base}/../schemas/*`);
    [EXPERIMENT, SESSION, ACCOUNT].forEach(function(schema) {
        var schemaData = JSON.stringify(schema, null, 4);
        var filename = schema.schema.id;
        fs.writeFile(`${base}/../schemas/${filename}.json`, schemaData);
    });
};

export const SESSIONSCHEMA = {
    "type": "jsonschema",
    "schema": {
        "type": "object",
        "properties": {
            "profileId": {
                "id": "profileId",
                "type": "string",
                "pattern": "\\w+\\.\\w+"
            },
            "profileVersion": {
                "id": "profileVersion",
                "type": "string"
            },
            "experimentId": {
                "id": "experimentId",
                "type": "string",
                "pattern": "\\w+\\.\\w+\\.\\w+"
            },
            "experimentVersion": {
                "id": "experimentVersion",
                "type": "string"
            },
            "sequence": {
                "id": "sequence",
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "softwareVersion": {
                "id": "softwareVersion",
                "type": "string"
            },
            "expData": {
                "id": "expData",
                "type": "object"
            },
            "feedback": {
                "$oneOf": [{
                    "id": "feedback",
                    "type": "string"
                }, null]
            },
            "hasReadFeedback": {
                "$oneOf": [{
                    "id": "hasReadFeedback",
                    "type": "boolean"
                }, null]
            }
        },
        "required": [
            "profileId",
            "profileVersion",
            "experimentId",
            "experimentVersion",
            "sequence",
            "softwareVersion",
            "expData"
        ]
    }
};

export const SESSIONSCHEMA = {
    'type': 'jsonschema',
    'schema': {
        'type': 'object',
        'properties': {
            'completed': {
                'type': 'boolean'
            },
            'profileId': {
                'type': 'string',
                'pattern': '\\w+\\.\\w+'
            },
            'experimentId': {
                'type': 'string',
                'pattern': '\\w+\\.\\w+\\.\\w+'
            },
            'experimentVersion': {
                'type': 'string'
            },
            'sequence': {
                'type': 'array',
                'items': {
                    'type': 'string'
                }
            },
            'expData': {
                'type': 'object'
            },
            'feedback': {
                '$oneOf': [{
                    'type': 'string'
                }, null]
            },
            'hasReadFeedback': {
                '$oneOf': [{
                    'type': 'boolean'
                }, null]
            },
            'earlyExit': {
                '$oneOf': [{
                    'type': 'object'
                }, null],
                'properties': {
                    'reason': {
                        '$oneOf': [{
                            'type': 'string'
                        }, null]

                    },
                    'privacy': {
                        'type': 'string'
                    }
                }
            }
        },
        'required': [
            'profileId',
            'experimentId',
            'experimentVersion',
            'completed',
            'sequence',
            'expData'
        ]
    }
};

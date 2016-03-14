export const SESSIONSCHEMA = {
    'type': 'jsonschema',
    'schema': {
        'type': 'object',
        'properties': {
            'profileId': {
                'id': 'profileId',
                'type': 'string',
                'pattern': '\\w+\\.\\w+'
            },
            'experimentId': {
                'id': 'experimentId',
                'type': 'string',
                'pattern': '\\w+\\.\\w+\\.\\w+'
            },
            'experimentVersion': {
                'id': 'experimentVersion',
                'type': 'string'
            },
            'sequence': {
                'id': 'sequence',
                'type': 'array',
                'items': {
                    'type': 'string'
                }
            },
            'expData': {
                'id': 'expData',
                'type': 'object'
            },
            'feedback': {
                '$oneOf': [{
                    'id': 'feedback',
                    'type': 'string'
                }, null]
            },
            'hasReadFeedback': {
                '$oneOf': [{
                    'id': 'hasReadFeedback',
                    'type': 'boolean'
                }, null]
            },
            'earlyExit': {
                'id': 'earlyExit',
                'type': ['object', 'null'],
                'properties': {
                    'reason': {
                        'type': ['string', 'null']
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
            'sequence',
            'expData'
        ]
    }
};

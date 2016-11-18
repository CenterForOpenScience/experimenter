// TODO: This is duplicated from generate_schemas and both files must be changed when schema or patterns are updated
var JAM_ID_PATTERN = '\\w+';
var PROFILE_ID_PATTERN = '\\w+\\.\\w+';

export const SESSIONSCHEMA = {
    type: 'jsonschema',
    schema: {
        type: 'object',
        properties: {
            completed: {
                type: 'boolean'
            },
            profileId: {
                type: 'string',
                pattern: PROFILE_ID_PATTERN
            },
            experimentId: {
                type: 'string',
                pattern: JAM_ID_PATTERN
            },
            experimentVersion: {
                type: 'string'
            },
            sequence: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            expData: {
                type: 'object'
            },
            feedback: {
                $oneOf: [{
                    type: 'string'
                }, null]
            },
            hasReadFeedback: {
                $oneOf: [{
                    type: 'boolean'
                }, null]
            },
            earlyExit: {
                $oneOf: [{
                    type: 'object'
                }, null],
                properties: {
                    reason: {
                        $oneOf: [{
                            type: 'string'
                        }, null]

                    },
                    privacy: {
                        type: 'string'
                    }
                }
            }
        },
        required: [
            'profileId',
            'experimentId',
            'experimentVersion',
            'completed',
            'sequence',
            'expData'
        ]
    }
};

import Ember from 'ember';
import { SESSIONSCHEMA } from 'experimenter/const';

//https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function createSchema(container, sequence, frames) {
    var setProperty = function (schema, frameId, frame, dataSchema) {
        var match;
        if (!dataSchema) {
            var component = container.lookup(`component:${frame.kind}`);
            match = component.meta.data;
        } else {
            match = dataSchema;
        }
        schema[`^(?:\\d+\\-)+${escapeRegExp(frameId)}(\\-\\d+)?$`] = match;
    };
    var schema = {};
    Object.keys(frames).forEach(frameId => {
        var frame = frames[frameId];
        if (frame.kind === 'choice' || frame.kind === 'block') {
            if (frame.options) {
                frame.options.forEach(opt => {
                    setProperty(schema, opt, frames[opt]);
                });
            } else {
                setProperty(schema, frameId, null, {
                    '$oneOf': [
                        'object',
                        'string',
                        'number',
                        'array'
                    ]
                });
            }
        } else {
            setProperty(schema, frameId, frame);
        }
    });

    return schema;
}


export default Ember.Controller.extend({
    breadCrumb: 'Edit',
    toast: Ember.inject.service('toast'),

    experimentJson: Ember.computed('model', {
        get: function () {
            return JSON.stringify(this.get('model.structure'), null, 4);
        },
        set: function () {
            return JSON.stringify(this.get('model.structure'), null, 4);
        }
    }),

    actions: {
        submit(editor) {
            let parsed;
            try {
                parsed = JSON.parse(editor.getValue());
            } catch (e) {
                console.log('Syntax error in JSON payload: ', e);
                this.toast.error('Please check the experiment for syntax errors before saving');
                return;
            }

            let schema = Object.assign({}, SESSIONSCHEMA);

            try {
                schema.schema.properties.expData = {
                    type: 'object',
                    patternProperties: createSchema(Ember.getOwner(this), parsed.sequence, parsed.frames),
                    additionalProperties: false
                };
            } catch (e) {
                console.log('Could not validate incomplete or incorrect experiment definition: ', e);
                this.toast.error('Please check experiment definition for missing or incomplete fields before saving');
                return;
            }

            this.set('model.structure', parsed);
            this.set('model.schema', schema);
            //HACK set just returns the value passed in, not the value returned by the underlying set
            //But calling get returns the value returned by set....
            this.get('model.schema', schema).then(() => this.get('model').save())
                .then(() => this.toast.success('Experiment updated'))
                .catch(() => this.toast.error('The server refused to save the data, likely due to a schema error'));

        },
        discard() {
            this.get('model').rollbackAttributes();
            this.set('experimentJson', null);
            this.transitionToRoute('experiments.info');
        }
    }
});

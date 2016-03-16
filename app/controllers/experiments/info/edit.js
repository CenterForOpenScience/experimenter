import Ember from 'ember';
import { SESSIONSCHEMA } from 'experimenter/const';

const { getOwner } = Ember;

//https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function regexRange(lo, hi) {
    let re = [];
    hi = hi.toString();
    lo = lo.toString();
    while (hi.length > lo.length) {
        re.push(hi.split('').reduce((acc, c) => {
            return acc + `[${acc.length === 0 ? 1 : 0}-${c}]`;
        }, ''));
        hi = '9'.repeat(hi.length - 1);
    }
    let i = 0;
    re.push(lo.split('').reduce((acc, c) => {
        return acc + `[${c}-${hi[i++]||c}]`;
    }, ''));

    return `(?:${re.map(s => `(?:${s})`).join('|')})`;
}


function createSchema(container, sequence, frames) {
    let i = 0;
    let j = 0;
    let props = {};
    let framePattern = new RegExp(/^exp(?:-\w+)+$/);

    function _parse(frame) {
        if (framePattern.test(frame.kind)) {
            props[`^${j}\\-${escapeRegExp(sequence[i])}$`] = container.lookup(`component:${frame.kind}`).meta.data;
        }
        else if(frame.kind === 'block') {
            frame.options.forEach(f => _parse(f));
        }
        else if(frame.kind === 'choice' && (frame.sampler || 'random') === 'random') {
            props[`^${j}\\-(?:${frame.options.map(id => `(?:${escapeRegExp(id)})`).join('|')})$`] = {
                $oneOf: frame.options.map(f => container.lookup(`component:${frames[f].kind}`).meta.data)
            };
        }
        else if(frame.kind === 'choice' && frame.sampler === 'shuffle') {
            props[`^${regexRange(j, j+=(frame.options.length-1))}\\-(?:${frame.options.map(id => `(?:${escapeRegExp(id)})`).join('|')})$`] = {
                $oneOf: frame.options.map(f => container.lookup(`component:${frames[f].kind}`).meta.data)
            };
        }
        else if(frame.kind === 'choice' && frame.sampler === 'rotate') {
            props[`^${regexRange(j, j+=(frame.options.length-1))}\\-(?:${frame.options.map(id => `(?:${escapeRegExp(id)})`).join('|')})$`] = {
                $oneOf: frame.options.map(f => container.lookup(`component:${frames[f].kind}`).meta.data)
            };
        }
        else {
            throw `Experiment definition specifies an unknown kind of frame: ${frame.kind}`;
        }
    }

    for(; i < sequence.length; i++, j++)
        _parse(frames[sequence[i]]);

    return props;
}


export default Ember.Controller.extend({
    breadCrumb: 'Edit',
    toast: Ember.inject.service('toast'),

    experimentJson: Ember.computed('model', function () {
        return JSON.stringify(this.get('model.structure'), null, 4);
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
                    patternProperties: createSchema(getOwner(this), parsed.sequence, parsed.frames),
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
                .then(() => {
                    this.toast.success('Experiment updated');
                    return this.transitionToRoute('experiments.info.index', this.get('model.id'));
                })
                .catch(() => this.toast.error('The server refused to save the data, likely due to a schema error'));

        }
    }
});

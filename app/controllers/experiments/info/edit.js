import Ember from 'ember';
import { SESSIONSCHEMA } from 'experimenter/const';

const { getOwner } = Ember;

//https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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

    return '^' + re.join('|') + '$';
}

export default Ember.Controller.extend({
    breadCrumb: 'Edit',
    toast: Ember.inject.service('toast'),

    experimentJson: function() {
        return JSON.stringify(this.get('model.structure'), null, 4);
    }.property('model'),

    actions: {
        submit(editor) {
            let container = getOwner(this);
            let parsed = JSON.parse(editor.getValue());

            let schema = Object.assign({}, SESSIONSCHEMA);
            var framePattern = new RegExp(/^exp(?:-\w+)+$/);

            let j = 0;
            let props = {};
            let length = parsed.sequence.length;

            for(let i = 0; i < length; i++, j++) {
                let frame = parsed.frames[parsed.sequence[i]];

                if (framePattern.test(frame.kind))
                    props[`${j}\\-${escapeRegExp(frame.kind)}`] = container.lookup(`component:${frame.kind}`).meta.data;
                else if(frame.kind === 'block')
                    frame.options.forEach((f) => {
                        props[`${j++}\\-${escapeRegExp(f.kind)}`] = container.lookup(`component:${parsed.frames[f].kind}`).meta.data;
                    });
                else if(frame.kind === 'choice')
                    props[`${regexRange(j, j+=(frame.options.length-1))}\\-${escapeRegExp(frame.kind)}`] = {
                        $oneOf: frame.options.map(f => container.lookup(`component:${parsed.frames[f].kind}`).meta.data)
                    };
                else
                    throw `Experiment definition specifies an unknown kind of frame: ${config.kind}`;
            }

            schema.schema.properties.expData = {
                type: 'object',
                patternProperties: props,
                additionalProperties: false
            };

            this.set('model.schema', schema);
            this.set('model.structure', parsed);

            this.get('model').save().then(() => { // resolve
                this.transitionToRoute('experiments.info');
            }, () => { // reject
                this.toast.error('The server refused to save the data, likely due to a schema error');
            });
        }
    }
});

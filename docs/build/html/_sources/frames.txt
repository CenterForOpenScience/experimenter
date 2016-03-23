# Development: Custom Frames

### Overview

You may find you have a need for some experimental component is not included in Experimenter already. The goal of this section is to walk through extending the base functionality with your own code.

We use the term 'frame' to describe the combination of JavaScript file and Handlebars HTML template that compose a **block** of an experiment.

Experimenter is composed of three main modules:

- **experimenter**: the main Experimenter GUI
- **lib/exp-models**: the data models used by **experimenter** and other applications
- **exp-player**: the built-in rendering engine for experiments built in Experimenter

Generally, all 'frame' development will happen in the exp-player module. By nature of the way the Experimenter respository is structured, this will mean making changes in the `experimenter/lib/exp-player` directory. These changes can be committed as part of the [exp-addons](https://github.com/CenterForOpenScience/exp-addons) git submodule (installed under `experimenter/lib`)

### Getting Started

One of the features of [Ember CLI](http://www.ember-cli.com/) is the abilty to provide 'blueprints' for code. These are basically just templates of all of the basic boilerplate needed to create a certain piece of code. To begin developing your own frame:

```bash
cd experimenter/lib/exp-player
ember generate exp-frame exp-<your_name>
```

Where `<your_name>` corresponds with the name of your choice.

#### A Simple Example

Let's walk though a basic example of 'exp-consent-form':

```bash
$ ember generate exp-frame
installing exp-frame
  create addon/components/exp-consent-form/component.js
  create addon/components/exp-consent-form/template.hbs
  create app/components/exp-consent-form.js
```

Notice this created three new files:
- `addon/components/exp-consent-form/component.js`: the JS file for your 'frame'
- `addon/components/exp-consent-form/template.hbs`: the Handlebars template for your 'frame'
- `app/components/exp-consent-form.js`: a boilerplate file that exposes the new frame to the Ember app-- don't modify this file unless you know what you're doing

Let's take a deeper look at the `component.js` file:

```javascript
import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import layout from './template';

export default ExpFrameBaseComponent.extend({
    type: 'exp-consent-form',
    layout: layout,
    meta: {
        name: 'ExpConsentForm',
        description: 'TODO: a description of this frame goes here.',
        parameters: {
            type: 'object',
            properties: {
                // define parameters here
            }
        },
        data: {
            type: 'object',
            properties: {
                // define data structure here
            }
        }
    }
});
```

The first section:

```javascript
import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import layout from './template';

export default ExpFrameBaseComponent.extend({
    type: 'exp-consent-form',
    layout: layout,
...
})
```

does a couple things:
- imports the `ExpFrameBaseComponent`: this is the superclass that all 'frames' must extend
- imports the `layout`: this tells Ember what template to use
- extends `ExpFrameBaseComponent` and specifies `layout: layout`


Next is the 'meta' section:

```javascript
...
    meta: {
        name: 'ExpConsentForm',
        description: 'TODO: a description of this frame goes here.',
        parameters: {
            type: 'object',
            properties: {
                // define parameters here
            }
        },
        data: {
            type: 'object',
            properties: {
                // define data structure here
            }
        }
    }
...
```

which is comprised of:
- name (optional): A human readable name for this 'frame'
- description (optional): A human readable descripion for this 'frame'
- parameters: JSON Schema defining what parameters this 'frame' accepts
- data: JSON Schema defining what data this 'frame' outputs

#### Building out the Example

Let's add some basic functionality to this 'frame'. First define some of the expected parameters:

```javascript
...
    meta: {
        ...,
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    default: 'Notice of Consent'
                },
                body: {
                    type: 'string',
                    default: 'Do you consent to participate in this study?'
                },
                consentLabel: {
                    type: 'string',
                    default: 'I agree'
                }
            }
        }
    },
...
```

And also the output data:

```javascript
...,
    data: {
        type: 'object',
            properties: {
                consentGranted: {
                    type: 'boolean',
                    default: false
                }
            }
        }
    }
...
```

Since we indicated above that this 'frame' has a `consentGranted` property, let's add it to the 'frame' definition:

```javascript
export default ExpFrameBaseComponent.extend({
    ...,
    consentGranted: null,
    meta: {
    ...
    }
...
```


Next let's update `template.hbs` to look more like a consent form:

```html
<div class="well">
  <h1>{{ title }}</h1>
  <hr>
  <p> {{ body }}</p>
  <hr >
  <div class="input-group">
    <span>
      {{ consentLabel }}
    </span>
    {{input type="checkbox" checked=consentGranted}}
  </div>
</div>
<div class="row exp-controls">
  <!-- Next/Last/Previous controls. Modify as appropriate -->
  <div class="btn-group">
    <button class="btn btn-default" {{ action 'previous' }} > Previous </button>
    <button class="btn btn-default pull-right" {{ action 'next' }} > Next </button>
  </div>
</div>
```

We don't want to let the participant navigate backwards or to continue unless they've checked the box, so let's change the footer to:

```html
<div class="row exp-controls">
  <div class="btn-group">
    <button class="btn btn-default pull-right" disabled={{ consentNotGranted }} {{ action 'next' }} > Next </button>
  </div>
</div>
```

Notice the new property `consentNotGranted`; this will require a new computed field in our JS file:

```javascript
    meta: {
        ...
    },
    consentNotGranted: Ember.computed.not('consentGranted')
});
```

#### Testing out the Example


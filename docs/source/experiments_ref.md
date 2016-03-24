# Glossary of Experimental Components

### general patterns

##### text-blocks

Many of these components expect one or more paramters with the structure:
```json
{
   "title": "My title",
   "text": "Some text here" // optional,
   "markdown": "Some markdown text here" // optional
}
```

This pattern will be referred to in the rest of this document as a 'text-block'. Note: a text-block may specify _either_ a  'text' property or a 'markdown' property. The 'text' property supports lightwieght formatting using the '\n' character to create a newline, and '\t' to create indentation. The 'markdown' property will be formatted as [markdown](http://daringfireball.net/projects/markdown/).

##### remote-resources

Some items support loading additional content from a remote resource. This uses the syntax:

`(JSON|URL):<url>`

where the `JSON:` prefix means the fetched content should be parsed as JSON, and the `URL:` prefix should be interpreted as plain text. Examples are:

`"formSchema": "JSON:https://s3.amazonaws.com/exampleexp/my_survey.json"`

and

`"text": "URL:https://s3.amazonaws.com/exampleexp/consent_text.txt"`

### exp-audioplayer

[view source code](https://github.com/CenterForOpenScience/exp-addons/blob/develop/exp-player/addon/components/exp-audioplayer.js)

##### example
![example](_static/img/exp-audioplayer.png)

```json
{
    "kind": "exp-audioplayer",
    "autoplay": false,
    "fullControls": true,
    "mustPlay": true,
    "images": [],
    "prompts": [{
        "title": "Instead of a consent form...",
        "text": "Here's a helpful tip."
    }, {
        "title": "A horse is a horse",
        "text": "But please don't say that backwards."
    }],
    "sources": [{
        "type": "audio/ogg",
        "src": "horse.ogg"
    }]
}
```

##### parameters

- **autoplay**: whether to autoplay the audio on load
  - type: true/false
  - default: true
- **fullControls**: whether to use the full player controls. If false, display a single button to play audio from the start.
  - type: true/false
  - default: true
- **mustPlay**: should the user be forced to play the clip before leaving the page?
  - type: true/false
  - default: true
- **sources**: list of objects specifying audio src and type
  - type: list
  - default: empty
- **title**:  a title to show at the top of the frame
  - type: text
  - default: empty
- **titlePrompt**: a title and description to show at the top of the frame
  - type: text-block
  - default empty
- **images**: a list of objects specifying image src, alt, and title
  - type: list
  - default: empty
- **prompts**: text of any header/prompt pararaphs to show the user.
  - type: list of text-blocks
  - default: empty

##### data

- **didFinishSound**: did the use play through the sound all of the way?
  - type: true/false

- - -

### exp-consent

[view source code](https://github.com/CenterForOpenScience/exp-addons/blob/develop/exp-player/addon/components/exp-consent.js)

##### example

![example](_static/img/exp-consent.png)

```json
{
    "kind": "exp-consent",
    "title": "Just checking",
    "body": "Are you sure you know what you're getting into?",
    "consentLabel": "I'm sure."
}
```

##### parameters

- **title**: a title for the consent form
  - type: text
  - default: 'Notice of Consent'
- **body**: body text for the consent form
  - type: text
  - default: 'Do you consent to take this experiment?'
- **consentLabel**: a label next to the consent form checkbox
  - type: text
  - default: 'I agree'

##### data

- **consentGranted**: did the user grant consent?
  - type: true/false

- - -

### exp-info

[view source code](https://github.com/CenterForOpenScience/exp-addons/blob/develop/exp-player/addon/components/exp-info/component.js)

##### example

![example](_static/img/exp-info.png)

```json
{
    "kind": "exp-info",
    "title": "For yor information",
    "blocks": [{
        "title": "Example 1.",
        "text": "This is just an example."
    }, {
        "title": "Example 2.",
        "text": "And this is another example"
    }]
}
```

##### parameters

- **title**: a title to go at the top of this block
  - type: text
  - default: empty
- **blocks**: a list of text-blocks to show
  - type: list of text-blocks
  - default: empty

##### data

None

- - -

### exp-survey

##### parameters

- **formSchema**: a JSON Schema defining a form; uses [Alpaca Forms](http://www.alpacajs.org/)
  - type: object (JSON Schema) or remote-resource
  - default: empty

##### data

- **formData**: an object mapping to the properties defined in **formSchema**
  - type: object

- - -

### exp-video-config

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-video-consent

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-video-preview

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-video-record

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-video-setup

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-mood-questionnaire

##### parameters

- a
- b

##### data

- a
- b

### exp-physics-info

##### parameters

- a
- b

##### data

- a
- b

- - -

### exp-physics-pre-video

##### parameters

- a
- b

##### data

- a
- b

- - -

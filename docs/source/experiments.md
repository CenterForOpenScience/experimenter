# Building an Experiment

### Prerequisites

If you are unfamiliar with the JSON format, you may want to spend a couple minutes reading the introduction here: 
[http://www.json.org/](http://www.json.org/).

Additionally, we use JSON Schema heavily throughout this project. The examples [here](http://json-schema.org/examples.html) 
are a great place to learn more about this specification.

A helpful resource to check your JSON Schema for simple errors like missing or extra commas, unmatched braces, etc. is [jsonlint](http://jsonlint.com/).

### Creating a new study and setting study details

You can click 'New Experiment' to get started working on your own study, or clone an existing study to copy its experiment definition. 

Here is the 'experiment detail view' for an example study. The primary purpose of the details you can edit in this view is to display the study to parents who might be interested in participating. You can select a thumbnail image, give a brief description of the study (like you would to a parent on the phone or at the museum if you were recruiting), and define an age range or other eligibility criteria. The "Participant Eligibility" string is just a description and can be in any format you want (e.g. "for girls ages 3 to 5" is fine) but parents will only see a warning about study eligibility based on the minimum/maximum ages you set. Those can be in months, days, or years. Parents who try to participate will see a warning if their child is younger (asking them to wait if they can) or older (letting them know we won't be able to use their data) but are not actually prevented from participating.

You won't see your study on Lookit until it's started (made active). You can start/stop your study here on the detail page.

![example](_static/img/experimenter-detail-view.png)

Here are the corresponding study views on Lookit:

![example](_static/img/lookit-view-1.png)

![example](_static/img/lookit-view-2.png)

> Try it yourself: Make your own study on staging-experimenter, choose a thumbnail, and enter a description. Look on Lookit: you don't see it, because you haven't started the study yet. Start the study from Experimenter and refresh Lookit: there it is! 

Your study's unique ID can be seen in the URL as you view it from either Experimenter or Lookit.

### Experiment structure

To define what actually happens in your study, go to "Build Experiment" at the bottom of the detail page. In this "experiment editor" view, Experimenter provides an interface to define the structure of an experiment using a JSON document. This is composed of two segments:

- **structure**: a definition of the **frames** you want to utilize in your experiment. This must take the form of a JSON object, i.e. a set of key/value pairs.
- **sequence**: a list of keys from the **structure** object. These need not be unique, and items from **structure** may be repeated. This determines the order that **frames** in your experiment will be shown.

> *Note:* the term **frame** refers to a single segment of your experiment. Examples of this might be: a consent form, 
a survey, or some video stimulus. Hopefully this idea will become increasing clear as you progress through this guide.

To explain these concepts, let's walk through an example:

```json
{
    "frames": {
        "intro-video": {
            "kind": "exp-video",
            "sources": [
                {
                    "type": "video/webm",
                    "src": "https://s3.amazonaws.com/exampleexp/my_video.webm"
                },
                {
                    "type": "video/ogg",
                    "src": "https://s3.amazonaws.com/exampleexp/my_video.ogg"
                },
                {
                    "type": "video/mp4",
                    "src": "https://s3.amazonaws.com/exampleexp/my_video.m4v"
                }
            ]
        },
        "survey-1": {
            "formSchema": "URL:https://s3.amazonaws.com/exampleexp/survey-1.json",
            "kind": "exp-survey"
        },
        "survey-2": {
            "formSchema": "URL:https://s3.amazonaws.com/exampleexp/survey-2.json",
            "kind": "exp-survey"
        },
        "survey-3": {
            "formSchema": "URL:https://s3.amazonaws.com/exampleexp/survey-3.json",
            "kind": "exp-survey"
        },
        "survey-randomizer": {
            "options": [
                "survey-1",
                "survey-2",
                "survey-3"
            ],
            "sampler": "random",
            "kind": "choice"
        },
        "exit-survey": {
            "formSchema": "URL:https://s3.amazonaws.com/exampleexp/exit-survey.json",
            "kind": "exp-survey"
        }
    },
    "sequence": [
        "intro-video",
        "survey-randomizer",
        "exit-survey"
    ]
}

```

This JSON document describes a fairly simple experiment. It has three basic parts (see 'sequence'):

1. intro-video: A short video clip that prepares participants for what is to come in the study. Multiple file formats
 are specified to support a range of web browsers.
2. survey-randomizer: A **frame** that randomly selects from one of the three 'options', in this case 'survey-1', 
  'survey-2', or 'survey-3'. The `"sampler": "random"` setting tells Experimenter to simply pick of of the options at 
  random. Other supported options are described here: TODO
3. exit-survey: A simple post-study survey. Notice for each of the **frames** with `"type": "exp-survey"` there is 
  a `formSchema` property that specifies the URL of another JSON schema to load. This corresponds with the input data 
  expected by [Alpaca Forms](http://www.alpacajs.org/documentation.html). An example of one of these schemas is below:
  
```json
{
    "schema": {
        "title": "Survey One",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "What is your name?"
            },
            "favColor": {
                "type": "string",
                "title": "What is your favorite color?",
                "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
            }
        }
    }
}```


### A Lookit study schema

A typical Lookit study might contain the following frame types:

1. exp-video-config
2. exp-video-consent
3. exp-lookit-text
4. exp-lookit-preview-explanation
5. exp-video-preview
6. exp-lookit-mood-questionnaire
7. exp-video-config-quality
8. exp-lookit-instructions
9. [Study-specific frames, e.g. exp-lookit-geometry-alternation, exp-lookit-story-page, exp-lookit-preferential-looking, exp-lookit-dialogue-page; generally, a sequence of these frames would be put together with a randomizer]
10. exp-lookit-exit-survey

For now, before any fullscreen frames, a frame that extends exp-frame-base-unsafe (like exp-lookit-instructions) needs to be used. A more flexible way to achieve this behavior is in the works!

### Randomizer frames

TODO: how to use a randomizer

### Testing your study

Experimenter has a built-in tool that allows you to try out your study. However, some functionality may not be exactly the same as on Lookit. We recommend testing your study from Lookit, which will be how participants experience it.

### Experiment data

TODO: how to see data. Within experimenter; with script.

The data saved when a subject participates in a study varies based on how that experiment is defined. The general 
structure for this **session** data is:

```json
{
    "type": "object",
    "properties": {
        "profileId": {
            "type": "string",
            "pattern": "\w+\.\w+"
        },
        "experimentId": {
            "type": "string",
            "pattern": "\w+"
        },
        "experimentVersion": {
            "type": "string"
        },
        "completed": {
            "type": "boolean"
        },
        "sequence": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "conditions": {
            "type": "object"
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
        "globalEventTimings": {
            "type": "array",
            "items": {
                "type": "object"
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
}
```

And descriptions of these properties are enumerated below:

- *profileId*: This unique identifier of the participant. This field follows the form: `<account.id>.<profile.id>`, where `<account.id>` is the unique identifier of the associated account, and `<profile.id>` is the unique identifier of the profile active during this particular session (e.g. the participating child). Account data is stored in a separate database, and includes demographic survey data and the list of profiles associated with the account.
- *experimentId*: The unique identifier of the study the subject participated in. 
- *experimentVersion*: The unique identifier of the version of the study the subject participated in. TODO: more on JamDB, versioning
- *completed*: A true/false flag indicating whether or not the subject completed the study.
- *sequence*: The sequence of **frames** the subject actually saw (after running randomization, etc.)
- *conditions*: For randomizers, this records what condition the subject was assigned
- *expData*: A JSON object containing the data collected by each **frame** in the study. More on this to follow.
- *feedback*: Some researchers may have a need to leave some session-specific feedback for a subject; this is shown to the participant in their 'completed studies' view.
- *hasReadFeedback*: A true/false flag to indicate whether or not the given feedback has been read.
- *globalEventTimings*: A list of events recorded during the study, not tied to a particular frame. Currently used for recording early exit from the study; an example value is 

```json
"globalEventTimings": [
        {
            "exitType": "browserNavigationAttempt", 
            "eventType": "exitEarly", 
            "lastPageSeen": 0, 
            "timestamp": "2016-11-28T20:00:13.677Z"
        }
    ]
```

#### Sessions and `expData` in detail

Continuing with the example from above, lets walk through the data collected during a session (note: some fields are hidden):

```json
{
	"sequence": [
		"0-intro-video",
		"1-survey-2",
		"2-exit-survey"
	],
	"conditions": {
		"survey-randomizer": 1
	},
	"expData": {
		"0-intro-video": {
			"eventTimings": [{
				"eventType": "nextFrame",
				"timestamp": "2016-03-23T16:28:20.753Z"
			}]
		},
		"1-survey-2": {
			"formData": {
				"name": "Sam",
				"favPie": "pecan"
			},
			"eventTimings": [{
				"eventType": "nextFrame",
				"timestamp": "2016-03-23T16:28:26.925Z"
			}]
		},
		"2-exit-survey": {
			"formData": {
				"thoughts": "Great!",
				"wouldParticipateAgain": "Yes"
			},
			"eventTimings": [{
				"eventType": "nextFrame",
				"timestamp": "2016-03-23T16:28:32.339Z"
			}]
		}
	}
}
```

Things to note:
- 'sequence' has resolved to three items following the pattern `<order>-<frame.id>`, where `<order>` is the order in 
  the overall sequence where this **frame** appeared, and `<frame.id>` is the identifier of the frame as defined in 
  the 'frames' property of the experiment structure. Notice in particular that since 'survey-2' was randomly selected, 
  it appears here.
- 'conditions' has the key/value pair `"1-survey-randomizer": 1`, where the format `<order>-<frame.id>` corresponds 
  with the `<order>` from the 'sequence' of the *original* experiment structure, and the `<frame.id>` again corresponds 
  with the identifier of the frame as defined in 
  the 'frames' property of the experiment structure.
- 'expData' is an object with three properties (corresponding with the values from 'sequence'). You may 
  notice that each of these objects have the common 'eventTimings' property- this is a place to collect 
  user-interaction events during an experiment, and by default contains the 'nextFrame' event which records when the 
  user progressed to the next **frame** in the 'sequence'. Other properties besides 'eventTimings' are dependent on 
  the **frame** type. Notice that 'exp-video' captures no data, and that both 'exp-survey' **frames** capture a 
  'formData' object.
  
  TODO: events and saved data: how to use the docs to view.

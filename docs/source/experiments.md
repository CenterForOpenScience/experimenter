# Building an Experiment

### Prerequisites

If you are unfamiliar with the JSON format, you may want to spend a couple minutes reading the introduction here: [http://www.json.org/](http://www.json.org/).

Additionally, we use JSON Schema heavily throughout this project. The examples [here](http://json-schema.org/examples.html) are a great place to learn more about this specification.

### Experiment structure

Experimenter prevides an interface to define the structure of an experiment using a JSON document. This is composed to two segments:

- **structure**: a definition of the **blocks** you want to utilize in your experiment. This must take the form of a JSON object, i.e. a set of key/value pairs.
- **seqeunce**: a list of keys from the **structure** object. These need not be unique, and items from **structure** may be repeated. This determines the order
that **blocks** in your experiment will be shown.

> *Note:* the term **block** refers to a single segment of your experiment. Examples of this might be: a consent form, a survey, or some video stimulus. Hopefully this idea will become increasing clear as you progress through this guide.

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

1. intro-video: A short video clip that prepares participants for what is to come in the study. Multiple file formats are specified to support a range of web browsers.
2. survey-randomizer: A **block** that randomly selects from one of the three 'options', in this case 'survey-1', 'survey-2', or 'survey-3'. The `"sampler": "random"` setting tells Experimenter to simply pick of of the options at random. Other supported options are described here: TODO
3. exit-survey: A simple post-study survey. Notice for each of the **blocks** with `"type": "exp-survey"` there is a `formSchema` property that specifies the URL of another JSON schema to load. This corresponds with the input data expected by [Alpaca Forms](http://www.alpacajs.org/documentation.html). An example of one of these schemas is:
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
}
```

### Experiment data

The data saved when a subject participates in a study varies based on how that experiment is defined. The general structure for this **session** data is:

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
        "earlyExit": {
            "$oneOf": [{
                "type": "object"
            }, null],
            "properties": {
                "reason": {
                    "$oneOf": [{
                        "type": "string"
                    }, null]

                },
                "privacy": {
                    "type": "string"
                }
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

- *profileId*: This unqiue identifier of the participant. Presently this field follows the form: `<account.id>.<profile.id>`, where `<account.id>` is the unique identifier of the associated account (more information on account and profile data strucutres here: TODO), and `<profile.id>` is the unique identifier of the profile active during this particular session.
- *experimentId*: The unique identifier of the study the subject participated in.
- *experimentVersion*: The unique indentifier of the version of the study the subject pariticipated in. TODO: more on JamDB, versioning
- *completed*: A true/false flag indicating whether or not the subject completed the study.
- *sequqence*: The sequence of **blocks** the subject actually saw (after running randomization, etc.)
- *conditions*: For randomizers, this records what condition the subject was assigned
- *expData*: A JSON object containing the data collected by each **block** in the study. More on this to follow.
- *feedback*: Some reasearchers may have a need to leave some session-specific feedback for a subject or internal use.
- *hasReadFeedback*: A true/false flag to indicate whether or not the given feedback has been read.
- *earlyExit*: If a subject chooses to leave a study early, a researcher may wish to collect some feedback as to why. This field is a place to store this feedback. (TODO more detail?)

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
- 'sequence' has resolved to three items following the pattern `<order>-<block.id>`, where `<order>` is the order in the overall sequence where this **block** appeared, and `<block.id>` is the identifier of the block as definited in the 'frames' property of the experiment structure. Notice in particular that since 'survey-2' was randomly selected, it appears here.
- 'conditions' has the key/value pair `"1-survey-randomizer": 1`, where the format `<order>-<block.id>` corrsponds with the `<order>` from the 'sequence' of the *original* experiment structre, and the `<block.id>` again corresponds with the - 'expData' is an object with three properties (corresponding with the values from 'sequence'). You may notice that each of these objects have the common 'eventTimings' property -- this is a place to collect user-interaction events during an experiment, and by default contains the 'nextFrame' event which records when the user progressed to the next **block** in the 'sequence'. Other properties besides 'eventTimings' are dependant on the **block** type. Notice that 'exp-video' captures no data, and that both 'exp-survey' **blocks** capture a 'formData' object.


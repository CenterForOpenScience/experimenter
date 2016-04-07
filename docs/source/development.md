# Development: Installation

## Ember Dependencies

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Other Dependencies

* [JamDB](http://jamdb.readthedocs.org/en/latest/install.html): note this requires Python 3.5.X

## Installation

First:
```bash
git clone https://github.com/CenterForOpenScience/experimenter.git
cd experimenter
```

### exp-addons Submodule

The exp-addons submodule allows for sharing some of the core Ember code for Experimenter's frontend between different apps. In particular it contains:
- exp-player: The build-in rendering engine for Experimenter
- exp-models: The ember-data models, adapters, serializers, authorizers, and authenticators used by Experimenter

To pull in the submodule, run:
```bash
git submodule init
git submodule update
```

### Javascript Dependencies

To install, run:
```bash
npm install
bower install

cd lib/exp-player
npm install
bower install

cd ../exp-models
npm install
bower install
```

### Add a .env file

This project needs a file named '.env' in its root directory. This contains settings that are not suitable for publishing to GitHub. Your .env should look like:

```bash
OSF_CLIENT_ID=<client_id>
OSF_SCOPE=osf.users.all_read
OSF_URL=https://staging.osf.io	
OSF_AUTH_URL=https://staging-accounts.osf.io

JAMDB_URL=https://staging-metadata.osf.io

WOWZA_PHP='{}'
WOWZA_ASP='{}'
```

These variables correspond with:

- **OSF_CLIENT_ID**: The client ID of a developer app created on the OSF. For development purposes please use: [https://staging.osf.io/settings/applications/](https://staging.osf.io/settings/applications/).
- **OSF_SCOPE**: The scope of the OAuth token that users will need when logging in to Experimenter. We reccomend that you don't change this default unless you know what you're doing.
- **OSF_URL**: The URL of the OSF server you want to refer to. For develop please use our staging server.
- **OSF_AUTH_URL**: The URL of the OSF authentication server you wish to use. For development purposes please leave this pointed at the staging-accounts server.
- **JAMDB_URL**: JamDB is the backend for Experimenter, and this URL determines which instance of the app your copy of Experimenter will use. For development purposes, please use the staging-metadata server.
- **WOWZA_PHP/ASP**: These settings configure how the app will connect to a Wowza server (for streaming video uploads). Most devlopers will not need this feature, and if you believe you do please open an issue on our GitHub page: [https://github.com/CenterForOpenScience/experimenter/issues](https://github.com/CenterForOpenScience/experimenter/issues).


### Run the Ember server

Run:
```bash
ember server
```

to fire up Ember's built in server to test the app locally.

### Bootstrapping in Example Data

First, create a file `admins.json` in `experimenter/scripts/`:

```json
[
    "<your_osf_id>"
]
```

Where `<your_osf_id>` is the user id of your [staging OSF Account](https://staging.osf.io/).

Next, run:
```bash
npm run boostrap
```

**Note**: this command will only work if you have successfully installed JamDB in a virtualenv named 'jam'

Which will create:
- an 'experimenter' namespace
- all of the collections needed for Experimenter to work

# Experimenter

> A platform to create and administer experiments.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

### Install exp-player

The Experimenter player (which runs the actual experiments) lives in it's own repository to support sharing of code and parallel development. See: https://github.com/CenterForOpenScience/exp-addons/tree/develop/exp-player

### Install exp-models

See: https://github.com/CenterForOpenScience/exp-addons/tree/develop/exp-models

## Running / Development

To login via OSF:
* create .env file in top directory
* in .env file include:
  * OSF_CLIENT_ID="\<client ID for staging account\>"
  * OSF_SCOPE="osf.users.all_read"
  * OSF_URL="https://staging-accounts.osf.io"

First:
* make sure jamdb is running, see: https://github.com/CenterForOpenScience/jamdb
* with your jamdb virtualenv active:
  * run the setup-jam script: `python dev/setup-jam.py`

This:
- Makes the _experimenter_ namespace in jamdb.
- Creates an _admins_ collection under the _experimenter_ namespace.
- Configures jamdb to use the schemas from `schemas/*.json` to validate records in the corresponding collections.
- Sets up permissions as defined in `dev/permissions.py`
- Populates the appropriate collections with the sample data in `dev/data`. See `dev/data/admins.json` for example logins; use:
```
namespace=experimenter
collection=admins
username=<id>
password=password
```

Then:
* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


# Experimenter

A platform to create and administer experiments.

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

## Running / Development

First:
* make sure jamdb is running, see: https://github.com/CenterForOpenScience/jamdb
* with your jamdb virtualenv active:
  * make sure commonregex is installed: `pip install commonregex`
  * run `python schemnas/generate.py` to generate json-schema files
  * run the setup-jam script: `python setup-jam.py`

This:
- Makes the _experimenter_ namespace in jamdb.
- Creates an _admins_ collection under the _experimenter_ namespace.
- Configures jamdb to use the schema from `schemas/admin.json` to validate _admins_ records.
- Adds a record 'root', with password 'password' to the _admins_ collection. This can be used to log in to the toast interface.
- Give the 'root' user ADMIN permissions on the _experimenter_ namespace.

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


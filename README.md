#### Master

![](https://travis-ci.org/CenterForOpenScience/experimenter.svg?branch=master)

#### Develop

![](https://travis-ci.org/CenterForOpenScience/experimenter.svg?branch=develop)

# Experimenter

> A platform to create and administer experiments.

Documentation available [here](http://experimenter.readthedocs.org/en/latest/)

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

### Install submodule dependencies

```bash
cd lib
git submodule init
git submodule update
```

#### Addons development

The exp-player and exp-models addons live in the lib directory. This is Ember's conventional place
for putting in-repo-addons (see package.json also). If you need to develop on either of the exp-*
addons, simply do your work in the submodule directory (lib/exp-<name>) and when you're ready commit
and push the changes like usual.


## Running / Development

To login via OSF:
* create .env file in top directory
* in .env file include:
```bash
OSF_CLIENT_ID="\<client ID for staging account\>"
OSF_SCOPE="osf.users.all_read"
OSF_URL="https://staging-accounts.osf.io"
SENTRY_DSN=""
```

First:
* make sure jamdb is running, see: https://github.com/CenterForOpenScience/jamdb
* then: `npm run bootstrap`

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

### COS is Hiring!

Want to help save science? Want to get paid to develop free, open source software? [Check out our openings!](http://cos.io/jobs) 

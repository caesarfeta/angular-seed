# angular-seed

This project is an application skeleton for [AngularJS](http://angularjs.org/) web apps.

## Prerequisites

* git
* npm

## Install

We have two kinds of dependencies in this project: tools and angular framework code.  

* Development tools are managed with `npm`, the [node package manager][npm].
* 3rd party Javascript libraries are managed with `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

    npm install
 
You now have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

## Run in development mode

Start the server:

    npm start

Go to `http://localhost:8000/app`

## Testing

There are two kinds of tests in the angular-seed application: Unit tests and End to End tests.

### Running Unit Tests

The angular-seed app comes preconfigured with unit tests. 
These are written in [Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. 
We provide a Karma configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `*.spec.js`.

The easiest way to run the unit tests is to use the supplied npm script:

    npm test

This script will start the Karma test runner to execute the unit tests. 
Karma will watch the source and test files for changes and re-run whenever any change.

Karma can also run the tests once and then exit.  

    npm run test-single-run


### End to end testing

The angular-seed app comes with end-to-end tests, again written in [Jasmine][jasmine]. 
These tests are run with the [Protractor][protractor] End-to-End test runner.  
It uses native events and has special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

    npm start

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

    npm run update-webdriver

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

    npm run protractor

This script will execute the end-to-end tests against the application being hosted on the
development server.

## Deploy

Coming soon...
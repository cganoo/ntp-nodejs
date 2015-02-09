# ntp-nodejs
[![Build Status](https://travis-ci.org/cganoo/ntp-nodejs.svg?branch=master)](https://travis-ci.org/cganoo/ntp-nodejs) [![Coverage Status](https://coveralls.io/repos/cganoo/ntp-nodejs/badge.svg)](https://coveralls.io/r/cganoo/ntp-nodejs)

A Node.js implementation of a simple NTP service with 1 Producer and multiple Consumers

## How to use this?

### Satisfy Dependencies

* Essential: [Node](http://nodejs.org/)
* Optional: Use latest [IntelliJ](https://www.jetbrains.com/idea/) with [Node.js support](https://www.jetbrains.com/idea/help/node-js.html) for easy experimentation with the source code

### Build the source from Github

1. `git clone https://github.com/cganoo/ntp-nodejs.git`
2. `cd ntp-nodejs/`
3. `npm install`

### Start the Producer in one console

* `npm run start-producer`

### Start the Consumers in another console

Default npm script to start 2 consumers:
* `npm run start-consumers`

If you want to flexibly specify number of consumers, then use:
* `node ./lib/consumers.js --consumers <n>`

The following cmdline options are available for starting consumers:
* `--help` : <b>Display usage</b>
* `--consumers` : <b>Integer number of consumers to instantiate</b>

### Running unit tests

[Mocha](http://mochajs.org/) framework is used to run unit tests via the standard npm test script:
* `npm test`

### Architecture

### Future Work

### License

ntp-nodejs is licensed under the MIT license. It is primarily intended for fun and instructive purposes.
Use this at your own risk.

### Author

Chaitanya Ganoo
www.linkedin.com/in/cganoo

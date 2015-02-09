# ntp-nodejs [![Build Status](https://travis-ci.org/cganoo/ntp-nodejs.svg?branch=master)](https://travis-ci.org/cganoo/ntp-nodejs) 

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

### A Sample Run:

<b>Console logs from Producer</b>
```
$ npm run start-producer

> ntp-nodejs@0.0.1 start-producer /Users/cganoo/workplace/ntp-nodejs
> node ./lib/producer.js

Producer instantiated on http://localhost:8080. Registering message listeners ...
Registered a new Consumer [id:01, lifetime:06, heartbeatCount:00, lastHeartbeatTime: 0, timeMsgCount:00]
Registered a new Consumer [id:02, lifetime:09, heartbeatCount:00, lastHeartbeatTime: 0, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:01, lastHeartbeatTime: 1423506685997, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:01, lastHeartbeatTime: 1423506685998, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:02, lastHeartbeatTime: 1423506691002, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:02, lastHeartbeatTime: 1423506691002, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:03, lastHeartbeatTime: 1423506695006, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:03, lastHeartbeatTime: 1423506695007, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:04, lastHeartbeatTime: 1423506700009, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:04, lastHeartbeatTime: 1423506700010, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:05, lastHeartbeatTime: 1423506705012, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:05, lastHeartbeatTime: 1423506705012, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:06, lastHeartbeatTime: 1423506710015, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:06, lastHeartbeatTime: 1423506710015, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:01, lifetime:06, heartbeatCount:07, lastHeartbeatTime: 1423506715020, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:07, lastHeartbeatTime: 1423506715020, timeMsgCount:00]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:08, lastHeartbeatTime: 1423506720021, timeMsgCount:00]
Sending NTP time to Consumer [id:01, lifetime:06, heartbeatCount:07, lastHeartbeatTime: 1423506715020, timeMsgCount:01]
Sending NTP time to Consumer [id:02, lifetime:09, heartbeatCount:08, lastHeartbeatTime: 1423506720021, timeMsgCount:01]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:09, lastHeartbeatTime: 1423506725025, timeMsgCount:01]
Received a keepAlive message from registered Consumer [id:02, lifetime:09, heartbeatCount:10, lastHeartbeatTime: 1423506730028, timeMsgCount:01]
All registered consumers have reached their max lifetime. Not sending NTP time messages ...
All registered consumers have reached their max lifetime. Not sending NTP time messages ...
All registered consumers have reached their max lifetime. Not sending NTP time messages ...
```

<b>Console logs from Consumers</b>
```
$ npm run start-consumers

> ntp-nodejs@0.0.1 start-consumers /Users/cganoo/workplace/ntp-nodejs
> node ./lib/consumer.js --consumers 2

Instantiating 2 consumers ...
Created Consumer [id:01, lifetime:06, heartbeatCount:00]
Created Consumer [id:02, lifetime:09, heartbeatCount:00]
Registering Consumer [id:01, lifetime:06, heartbeatCount:00]
Registering Consumer [id:02, lifetime:09, heartbeatCount:00]
Consumer [id:01, lifetime:06, heartbeatCount:00]: Successfully connected to producer
Consumer [id:02, lifetime:09, heartbeatCount:00]: Successfully connected to producer
Consumer [id:01, lifetime:06, heartbeatCount:01]: Sending keepAlive message [01/06]
Consumer [id:02, lifetime:09, heartbeatCount:01]: Sending keepAlive message [01/09]
Consumer [id:01, lifetime:06, heartbeatCount:02]: Sending keepAlive message [02/06]
Consumer [id:02, lifetime:09, heartbeatCount:02]: Sending keepAlive message [02/09]
Consumer [id:01, lifetime:06, heartbeatCount:03]: Sending keepAlive message [03/06]
Consumer [id:02, lifetime:09, heartbeatCount:03]: Sending keepAlive message [03/09]
Consumer [id:01, lifetime:06, heartbeatCount:04]: Sending keepAlive message [04/06]
Consumer [id:02, lifetime:09, heartbeatCount:04]: Sending keepAlive message [04/09]
Consumer [id:01, lifetime:06, heartbeatCount:05]: Sending keepAlive message [05/06]
Consumer [id:02, lifetime:09, heartbeatCount:05]: Sending keepAlive message [05/09]
Consumer [id:01, lifetime:06, heartbeatCount:06]: Sending keepAlive message [06/06]
Consumer [id:02, lifetime:09, heartbeatCount:06]: Sending keepAlive message [06/09]
Consumer [id:01, lifetime:06, heartbeatCount:07]: Sending keepAlive message [07/06]
Consumer [id:02, lifetime:09, heartbeatCount:07]: Sending keepAlive message [07/09]
Consumer [id:01, lifetime:06, heartbeatCount:07]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:02, lifetime:09, heartbeatCount:08]: Sending keepAlive message [08/09]
Consumer [id:01, lifetime:06, heartbeatCount:07]: Received time from producer as: 2015-02-09T10:32:00-08:00
Consumer [id:02, lifetime:09, heartbeatCount:08]: Received time from producer as: 2015-02-09T10:32:00-08:00
Consumer [id:01, lifetime:06, heartbeatCount:07]: Received time from producer as: 2015-02-09T10:32:00-08:00
Consumer [id:02, lifetime:09, heartbeatCount:08]: Received time from producer as: 2015-02-09T10:32:00-08:00
Consumer [id:01, lifetime:06, heartbeatCount:07]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:02, lifetime:09, heartbeatCount:09]: Sending keepAlive message [09/09]
Consumer [id:01, lifetime:06, heartbeatCount:07]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:02, lifetime:09, heartbeatCount:10]: Sending keepAlive message [10/09]
Consumer [id:01, lifetime:06, heartbeatCount:07]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:02, lifetime:09, heartbeatCount:10]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:01, lifetime:06, heartbeatCount:07]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
Consumer [id:02, lifetime:09, heartbeatCount:10]: All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...
```
## Architecture

The system is composed of 2 distinct node processes - Producer and Consumer(s). 
The current functionality supports simulating how Consumers can register with the Producer, keep on sending heartbeats for the duration of their lifetime and receive correct time from the Producer.

### Key Components:

* [Socket.io](http://socket.io/) is used for bidirectional event-based communication between Producer and Consumers.
* [Async](https://github.com/caolan/async) is used for asynchronous control flow.
* Other components can be found in the dependencies highlighted in package.json

### Key Assumptions:

* There is only 1 Producer.
* There can be 1 or more Consumers.
* It is assumed that the clock on the Producer is synced to an upstream NTP time and is thus accurate.

### Producer:

* The Producer sends a Time message every second to all registered Consumers. 
* It also consumes KeepAlive messages that it receives from registered Consumers. 
* If no KeepAlive is received from a given Consumer within 10 seconds, the Producer stops sending messages to that specific Consumer. 

### Consumer:

* A Consumer first registers to the Producer in order to start receiving Time messages.
* It then consumes the messages and logs the current time to the console. 
* After having registered with the Producer, a Consumer must also send a KeepAlive message to the Producer every 5 seconds. 
* However, each Consumer has a configurable maximum number of KeepAlive messages it can send, k. After having sent k messages, it can no longer send anymore KeepAlive messages. 
* The k parameter is randomly picked from the following integer interval: [0, 12]. 

### Messages exchanged between Producer and Consumers:

* <b>Register</b>: This message is sent by a Consumer to the Producer in order to start receiving Time messages.
* <b>Time</b>: This message is sent by the Producer and contains the current timestamp.
* <b>KeepAlive</b>: This message is sent by a Consumer to the Producer to indicate that the sending Consumer is alive and thus expecting to receive Time messages from the Producer.

### Additional message(s) that the Producer listens to:
* <b>Echo</b>: This message contains a payload which is simply echo'd back by the Producer. Useful for quick healthcheck on the producer or for unit testing.

## Future Work

* <b>NTP Implementation</b>: Implement the full [NTP](http://www.ntp.org/) protocol
* <b>Embedded data store</b>: Use something like [NeDB](https://github.com/louischatriot/nedb) as an embedded datstore for richer state storing and retrieval
* <b>Make Producer stateless</b>: Abstract away the state in a distinct datastore (e.g. redis) 
* <b>Add a UI</b>: Use [Express](http://expressjs.com/) to serve simple HTML pages showcasing Producer metrics
* <b>Increase test coverage</b>: Add more unit/integration tests to validate asynchronous socket.io interactions

## License

ntp-nodejs is licensed under the MIT license. It is primarily intended for fun and instructive purposes.
Use this at your own risk.

## Author

Chaitanya Ganoo
www.linkedin.com/in/cganoo

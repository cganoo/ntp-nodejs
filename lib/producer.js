/**
 *
 *
 */

var
    config = require("./config"),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server),
    consumers = [];

/**
 * A data structure to represent a consumer as seen by the producer.
 * Some attributes overlap with those defined in the Consumer structure on the client-side,
 * but this one can be thought of a server-side instrumented consumer.
 */
var Consumer = function (id, socketId, lifetime, heartbeatCount, lastHeartbeatTime, timeMsgCount) {
    this.id = id;
    this.socketId = socketId;
    this.lifetime = lifetime;
    this.heartbeatCount = heartbeatCount;
    this.lastHeartbeatTime = lastHeartbeatTime;
    this.timeMsgCount = timeMsgCount;
};

Consumer.prototype.describe = function () {
    return config.sprintf("Consumer [id:%'02d, lifetime:%'02d, heartbeatCount:%'02d, lastHeartbeatTime: %s, timeMsgCount:%'02d]", this.id, this.lifetime, this.heartbeatCount, this.lastHeartbeatTime, this.timeMsgCount);
}

server.listen(config.PRODUCER_PORT, function () {
    console.log('Producer instantiated at ' + config.PRODUCER_ADDRESS);
});

/**
 * Serve the main application file (index.html)
 * when a client makes a request to the app root
 */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * The main control flow
 */
config.async.waterfall([
    listen,
    sendTime
], function (err, result) {
});

/**
 *
 * @param callback
 * @returns {*}
 */
function listen(callback) {
    /* socket.io events, each connection goes through here */
    io.on('connection', function (socket) {

        /* After connection, the client initially sends a REGISTER message */
        socket.on(config.MESSAGE_REGISTER, function (data) {
            registerConsumer(socket, data);
        });

        /* The client sends a heartbeat periodically in the form of a KEEPALIVE message */
        socket.on(config.MESSAGE_KEEPALIVE, function (data) {
            keepAliveHandler(socket, data);
        });
    });
    return callback(null);
}

/**
 *
 * Cron job to send TIME messages every 1 minute, to registered consumers who are currently alive
 * @returns {*}
 */
function sendTime(callback) {

    new config.cronJob({
        cronTime: "0 */" + config.MESSAGE_TIME_FREQUENCY + " * * * *",
        onTick: function () {
            if (config._.isUndefined(consumers) || config._.isNull(consumers) || config._.isEmpty(consumers)) {
                console.log("No consumers are currently registered. Not sending NTP time messages ...");
            } else {
                var aliveConsumers = config._.filter(consumers, function (consumer) {
                    return config.moment.utc(config.moment().diff(config.moment(consumer.lastHeartbeatTime))) < config.KEEPALIVE_WINDOW;
                });
                if (config._.isUndefined(aliveConsumers) || config._.isNull(aliveConsumers) || config._.isEmpty(aliveConsumers)) {
                    console.log("All registered consumers have reached their max lifetime. Not sending NTP time messages ...");
                } else {
                    config.async.each(aliveConsumers, sendNTPTime, function (err) {
                    });
                }
            }
        },
        start: 'true'
    });
    return callback(null);
}


/**
 * Register a new consumer
 * @param socket
 * @param data
 */
function registerConsumer(socket, data) {
    var newConsumer = new Consumer(data.id, socket.id, data.lifetime, data.heartbeatCount, 0, 0);
    console.log("Registered a new " + newConsumer.describe());
    consumers.push(newConsumer);
}

/**
 * Handle the keepAlive message sent by a registered consumer
 * @param socket
 * @param data
 */
function keepAliveHandler(socket, data) {
    if (socket.id != data.socketId) {
        console.log("Something fishy!");
    }
    var registeredConsumer = config._.findWhere(consumers, {id: data.id, socketId: data.socketId});
    if (typeof registeredConsumer === "undefined") {
        console.log("Encountered an unregistered consumer " + data.id + " trying to send a keepAlive message. Ignoring this");
    } else {
        /* For a registered consumer who sent a keepAlive message, update relevant counters */
        registeredConsumer.heartbeatCount += 1;
        registeredConsumer.lastHeartbeatTime = new Date().getTime();
        console.log("Received a keepAlive message from registered consumer " + registeredConsumer.describe());
    }
}

/**
 *
 * @param data
 * @param callback
 */
function sendNTPTime(consumer, callback) {
    /* Update the counter tracking number of TIME messages sent to this consumer */
    ++consumer.timeMsgCount;
    console.log("Sending NTP time to " + consumer.describe());

    /* Send the time to this specific consumer only */
    var socketId = consumer.socketId;
    io.sockets.connected[socketId].emit(config.MESSAGE_TIME, {'time': (new Date()).getTime()});

    return callback(null);
}

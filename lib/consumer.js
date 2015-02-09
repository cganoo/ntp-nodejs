/**
 *
 *
 */
var
    config = require("./config"),
    io = require('socket.io-client'),
    program = require('commander'),
    consumers = [];

/**
 * A data structure to represent a consumer
 * A consumer is completely specified by its id, lifetime and socket attributes.
 */
var Consumer = function (id, lifetime, heartbeatCount, socket) {
    this.id = id;
    this.lifetime = lifetime;
    this.heartbeatCount = heartbeatCount;
    this.socket = socket;
};

Consumer.prototype.describe = function () {
    return config.sprintf("Consumer [id:%'02d, lifetime:%'02d, heartbeatCount:%'02d]", this.id, this.lifetime, this.heartbeatCount);
}

Consumer.prototype.serialize = function () {
    return {
        id: this.id,
        lifetime: this.lifetime,
        heartbeatCount: this.heartbeatCount,
        socketId: this.socket.id
    }
}

/**
 * Define the command line options for our program
 */
program
    .version('0.0.1')
    .option('-c, --consumers <n>', 'An integer argument specifying the number of consumers to instantiate', parseInt)
    .parse(process.argv);

if (!program.consumers) {
    console.log("It is necessary to specify the number of consumers, via the --consumers flag");
    process.exit(0);
}

console.log('Instantiating %j consumers ...', program.consumers);

/**
 * The mian control flow
 */
config.async.waterfall([
    createConsumerIds,
    createConsumers,
    listen,
    registerConsumers,
    sendHeartbeats
], function (err, result) {
});

/**
 * Create consumer ids
 * @param callback
 */
function createConsumerIds(callback) {
    /* Generate a range of integers from {1, ..., <program.consumers>} */
    var consumerIds = config._.range(1, program.consumers + 1, 1);
    callback(null, consumerIds);
}

/**
 * Create the consumers
 * @param consumerIds
 * @param callback
 */
function createConsumers(consumerIds, callback) {
    config.async.each(consumerIds, function (id) {

        /* Generate a lifetime value for this consumer */
        var k = getRandomInt(parseInt(config.MIN_LIFETIME), parseInt(config.MAX_LIFETIME));

        /* Initialize number of keep alive messages sent to producer as 0 */
        var heartbeatCount = 0;

        /* Initialize a consumer as not being registered to the producer */
        var isRegistered = false;

        /* Create a connection for the new consumer */
        var socket = io.connect(config.PRODUCER_ADDRESS, {'multiplex': config.USE_MULTIPLEXED_SOCKETS});

        /* Store this consumer in the list of consumers */
        var consumer = new Consumer(id, k, heartbeatCount, socket);
        console.log("Created " + consumer.describe());
        consumers.push(consumer);
    }, function (err) {
    });
    callback(null, consumers);
}

/**
 * For each consumer, listen to messages from the io.socket and the producer
 * @param consumers
 * @param listenCallback
 */
function listen(consumers, listenCallback) {
    config.async.each(consumers, function (consumer) {

        /* Listen to socket connect */
        consumer.socket.on(config.SOCKET_CONNECT, function (data) {
            console.log(consumer.describe() + ": Successfully connected to producer");
        });

        /* Listen to socket disconnect */
        consumer.socket.on(config.SOCKET_DISCONNECT, function (data) {
            console.log(consumer.describe() + ": Received a socket disconnect event. Terminating client program ...");
            process.exit(1);
        });

        /* Listen to socket connect error */
        consumer.socket.on(config.SOCKET_CONNECT_ERROR, function (data) {
            console.log(consumer.describe() + ": Received a socket connection error event. Terminating client program ...");
            process.exit(1);
        });

        /* Listen to socket connect timeout */
        consumer.socket.on(config.SOCKET_CONNECT_TIMEOUT, function (data) {
            console.log(consumer.describe() + ": Received a socket timeout event. Terminating client program ...");
            process.exit(1);
        });

        /* Listen to messages sent by the producer */
        consumer.socket.on(config.MESSAGE_TIME, function (data) {
            console.log(consumer.describe() + ": Received time from producer as: " + config.moment(data.time).format());
        });
    }, function (err) {
    });
    listenCallback(null, consumers);
}

/**
 * Optimistically register a consumer with the producer
 * @param consumers
 * @param registerCallback
 */
function registerConsumers(consumers, registerCallback) {
    config.async.each(consumers, function (consumer, callback) {
        /* Register this consumer by emitting a one-time REGISTER message */
        console.log("Registering " + consumer.describe());
        consumer.socket.emit(config.MESSAGE_REGISTER, consumer.serialize());
        callback(null);
    }, function (err) {
    });
    registerCallback(null, consumers);
}

/**
 * For each consumer send a heartbeat (keepAlive message) to the producer periodically
 * @param consumers
 * @param keepAliveCallback
 */
function sendHeartbeats(consumers, keepAliveCallback) {
    var connectedConsumers = config._.filter(consumers, function (consumer) {
        return true;;
    });
    if (config._.isUndefined(connectedConsumers) || config._.isNull(connectedConsumers) || config._.isEmpty(connectedConsumers)) {
        console.log("No consumers found to be connected to the producer. Not sending heartbeat messages. Terminating client program ...");
        process.exit(1);
    } else {
        /* Send the heartbeat */
        config.async.each(connectedConsumers, function (consumer) {
            /* Periodically emit a KEEPALIVE message until lifetime is reached */
            new config.cronJob({
                cronTime: "*/" + config.MESSAGE_KEEPALIVE_FREQUENCY + " * * * * *",
                onTick: function () {
                    /* If heartbeatCount equals a consumer's lifetime, then dont send a keepAlive message */
                    if (consumer.heartbeatCount <= consumer.lifetime) {
                        /*  Increment consumer's heartbeatCount attribute by 1 */
                        ++consumer.heartbeatCount;
                        console.log(consumer.describe() + config.sprintf(": Sending keepAlive message [%'02d/%'02d]", consumer.heartbeatCount, consumer.lifetime));
                        consumer.socket.emit(config.MESSAGE_KEEPALIVE, consumer.serialize());
                    } else {
                        console.log(consumer.describe() + ": All keepAlive messages have been exhausted. No longer in sync with producer NTP time ...");
                    }
                },
                start: 'true'
            });
        }, function (err) {
        });
        keepAliveCallback(null, consumers);
    }
}

/**
 * Returns a random integer between min (included) and max (excluded)
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

"use strict";
var
    io = require('socket.io-client'),
    config = require('../lib/config.js'),
    producer = require('../lib/producer.js');

var
    options = {
        'multiplex': config.USE_MULTIPLEXED_SOCKETS
    };

describe("Producer Tests:", function () {
    it("acknowledges consumer registration", function (done) {
        var client1 = io.connect(config.PRODUCER_ADDRESS, options);
        client1.on(config.SOCKET_CONNECT, function () {
            client1.on(config.MESSAGE_ACK, function (message) {
                message.should.equal(config.ACK_CONSUMER_REGISTRATION);
                client1.disconnect();
                done();
            });
            client1.emit(config.MESSAGE_REGISTER, {id: '1', lifetime: '2', heartbeatCount: '1', socketId: '10'});
        });
    });
});


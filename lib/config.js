module.exports = {

    /* Required modules */
    cronJob: require('cron').CronJob,
    async:   require("async"),
    moment:  require('moment'),
    _:       require('underscore'),
    sprintf: require('sprintf-js').sprintf,

    /* Constants */
    PRODUCER_PORT: '8080',
    PRODUCER_ADDRESS: "http://localhost:8080",

    /* To support multiple distinct consumers */
    USE_MULTIPLEXED_SOCKETS: "false",

    /* Custom message definitions that are understood by the producer and consumers */
    MESSAGE_REGISTER: "register",
    MESSAGE_KEEPALIVE: "keepAlive",
    MESSAGE_TIME: "time",

    /* Standard socket.io events */
    SOCKET_CONNECT: "connect",
    SOCKET_DISCONNECT: "disconnect",
    SOCKET_CONNECT_ERROR: "connect_error",
    SOCKET_CONNECT_TIMEOUT: "connect_timeout",

    /* The limits on the k-value for the configurable heartbeats that each consumer can send */
    MIN_LIFETIME: 1,
    MAX_LIFETIME: 12,

    /* If a consumer has not sent a heartbeat in 10 seconds it wont get any time messages */
    KEEPALIVE_WINDOW: "10000",

    /* Heartbeats are sent every 5 seconds */
    MESSAGE_KEEPALIVE_FREQUENCY: "5",

    /* Producer unicasts the current time every 1 minute */
    MESSAGE_TIME_FREQUENCY: "1"
};

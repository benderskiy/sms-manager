var EventEmitter = require('events').EventEmitter;
var util = require('util');
var async = require('async');

function SMSManager() {
    EventEmitter.call(this);
    this.transports = {};
    return this;
};

util.inherits(SMSManager, EventEmitter);
module.exports = new SMSManager();

// send [messages] array [{number: "...", text: "..."}, .., {..}] through transportName
SMSManager.prototype.send = function (transportName, messages) {
    this.transports[transportName].send(messages);
};

// adds new transport class
SMSManager.prototype.addTransport = function (transportName, TransportClass) {
    this.transports[transportName] = TransportClass;
};

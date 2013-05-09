var util = require("util");
var EventEmitter = require("events").EventEmitter;

var EventDispatcher = function () {
    EventDispatcher.super_.call(this);
}
util.inherits(EventDispatcher, EventEmitter);

EventDispatcher.prototype.addEventListener = EventDispatcher.prototype.addListener;
EventDispatcher.prototype.hasEventListener = function (listener) {
    if (EventEmitter.listeners(listener).length < 0) {
        return true;
    }

    return false;
}

EventDispatcher.prototype.removeEventListener = EventDispatcher.prototype.removeListener;
EventDispatcher.prototype.dispatchEvent = EventDispatcher.prototype.emit;

module.exports = EventDispatcher;
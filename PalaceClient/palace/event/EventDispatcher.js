var EventEmitter = require("events").EventEmitter;

var EventDispatcher = function () {
}

EventDispatcher.prototype.addEventListener = EventEmitter.addListener;
EventDispatcher.prototype.hasEventListener = function (listener) {
    if (EventEmitter.listeners(listener).length < 0) {
        return true;
    }

    return false;
}

EventDispatcher.prototype.removeEventListener = EventEmitter.removeListener;
EventDispatcher.prototype.dispatchEvent = EventEmitter.emit;

module.exports = EventDispatcher;
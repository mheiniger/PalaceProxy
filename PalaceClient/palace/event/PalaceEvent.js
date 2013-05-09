// var eventEmitter = require('events').EventEmitter;
var Event = require("./../../adapter/events/Event.js") //	import flash.events.Event;
var util = require("util");

var constants = {};
var ROOM_CHANGED = constants.ROOM_CHANGED/* :String */ = "roomChanged";

var CONNECT_START = constants.CONNECT_START/* :String */ = "connectStart";
var CONNECT_COMPLETE = constants.CONNECT_COMPLETE/* :String */ = "connectComplete";
var CONNECT_FAILED = constants.CONNECT_FAILED/* :String */ = "connectFailed";
var DISCONNECTED = constants.DISCONNECTED/* :String */ = "disconnected";
var GOTO_URL = constants.GOTO_URL/* :String */ = "gotoURL";
var AUTHENTICATION_REQUESTED = constants.AUTHENTICATION_REQUESTED/* :String */ = "authenticationRequested";
var ESP_CHANGED = constants.ESP_CHANGED/* :String */ = "espChanged";

function PalaceEvent(type/* :String */, bubbles, cancelable) // extends Event
{
    this.text/* :String */;
    this.url/* :String */;

    PalaceEvent.super_.call(this, type);

}
util.inherits(PalaceEvent, Event);

module.exports = PalaceEvent;
for (name in constants) {
    module.exports[name] = constants[name];
}
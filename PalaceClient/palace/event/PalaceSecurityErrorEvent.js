//package net.codecomposer.palace.event
//{
var Event = require("./../../adapter/events/Event.js"); //	import flash.events.Event;
var util = require("util");

var constants = {};
var SECURITY_ERROR = this.constants.SECURITY_ERROR = "securityError";

util.inherits(PalaceSecurityErrorEvent, Event); //extends Event
function PalaceSecurityErrorEvent(type/* :String */, bubbles/* :Boolean =false*/, cancelable/* :Boolean =false*/) {
    this.SECURITY_ERROR = SECURITY_ERROR/* :String */;

    PalaceSecurityErrorEvent.super_.call(this, type);

}
//}

module.exports = PalaceSecurityErrorEvent;
for (name in constants) {
    module.exports[name] = constants[name];
}
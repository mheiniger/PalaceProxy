var Event = require("./../../adapter/events/Event.js"); //	import flash.events.Event;
var util = require("util");

module.exports = PalaceSecurityErrorEvent;
module.exports.SECURITY_ERROR = "securityError";

util.inherits(PalaceSecurityErrorEvent, Event); //extends Event
function PalaceSecurityErrorEvent(type/* :String */, bubbles/* :Boolean =false*/, cancelable/* :Boolean =false*/) {
    PalaceSecurityErrorEvent.super_.call(this, type);
}

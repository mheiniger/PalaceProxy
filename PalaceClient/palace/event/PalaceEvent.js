var util = require("util");
var Event = require("./../../adapter/events/Event.js"); //	import flash.events.Event;

module.exports = PalaceEvent;
module.exports.SERVER_INFO_CHANGED = "serverInfoChanged";
module.exports.ROOM_CHANGED /* :String */ = "roomChanged";

module.exports.CONNECT_START/* :String */ = "connectStart";
module.exports.CONNECT_COMPLETE/* :String */ = "connectComplete";
module.exports.CONNECT_FAILED/* :String */ = "connectFailed";
module.exports.DISCONNECTED/* :String */ = "disconnected";
module.exports.GOTO_URL/* :String */ = "gotoURL";
module.exports.AUTHENTICATION_REQUESTED/* :String */ = "authenticationRequested";
module.exports.ESP_CHANGED/* :String */ = "espChanged";

util.inherits(PalaceEvent, Event);
function PalaceEvent(type/* :String */, bubbles, cancelable) // extends Event
{
    this.text/* :String */;
    this.url/* :String */;

    PalaceEvent.super_.call(this, type);

}
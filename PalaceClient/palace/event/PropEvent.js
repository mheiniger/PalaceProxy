var util = require("util");
var Event = require("./../../adapter/events/Event.js");

module.exports = PropEvent;
module.exports.PROP_LOADED/* :String */ = "propLoaded";
module.exports.PROP_DECODED/* :String */ = "propDecoded";
module.exports.LOOSE_PROP_LOADED/* :String */ = "loosePropLoaded";

util.inherits(PropEvent, Event); //extends Event
function PropEvent(type/* :String */, prop/* :PalaceProp =null*/) {
    if (prop) {
        this.prop = prop;
    }
    PropEvent.super_.call(this, type);
}


var Event = require("./../../adapter/events/Event.js");
var util = require("util");

module.exports = OPWSEvent;
var RESULT_EVENT = module.exports.RESULT_EVENT/* :String */ = 'result';
var FAULT_EVENT = module.exports.FAULT_EVENT/* :String */ = 'fault';


util.inherits(OPWSEvent, Event); //extends Event
function OPWSEvent(type/* :String */, bubbles/* :Boolean =false*/, cancelable/* :Boolean =false*/)
{
    OPWSEvent.super_.call(this, type);

    this.result/* :Object */ = {};
}
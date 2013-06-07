module.exports = URLLoader;

var util = require("util");
var Event = require('../events/Event');
var EventDispatcher = require('../events/EventDispatcher');


util.inherits(URLLoader, EventDispatcher); //extends EventDispatcher
function URLLoader() {
    URLLoader.super_.call(this);
    this.dataFormat = "";

    // emits: Event.COMPLETE, IOErrorEvent.IO_ERROR, SecurityErrorEvent.SECURITY_ERROR

    this.load = function(/* URLRequest */ request) {

    }
}
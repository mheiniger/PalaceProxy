var util = require("util");
var Event = require("./../../adapter/events/Event");
var EventDispatcher = require('./../../adapter/events/EventDispatcher');

module.exports = LoaderInfo;

util.inherits(LoaderInfo, EventDispatcher);//extends EventDispatcher
function LoaderInfo(){
    LoaderInfo.super_.call(this);
    var that = this;

    function dispatchEvent(event) {
        that.dispatchEvent(event.type, event);
    }
}
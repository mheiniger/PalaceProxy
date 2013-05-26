
var util = require("util");
var Event = require('../events/Event');
var EventDispatcher = require('../events/EventDispatcher');
var TimerEvent = require('../events/TimerEvent');

module.exports = Timer;


util.inherits(Timer, EventDispatcher); //extends EventDispatcher
function Timer(delay, repeatCount)
{
    Timer.super_.call(this);
    this.currentCount = 0;
    this.delay = delay || 0;
    this.repeatCount = repeatCount || 0;
    this.running = false;
    this._intervalID = null;
}

Timer.prototype.start = function () {
    if (this.running === false) {
        var that = this;
        this._intervalID = setInterval(function(){
            that.currentCount++;
            var timerEvent = new TimerEvent(TimerEvent.TIMER);
            that.dispatchEvent(timerEvent.type, timerEvent);
            if(that.currentCount === that.repeatCount) {
                var timerCompleteEvent = new TimerEvent(TimerEvent.TIMER_COMPLETE);
                that.dispatchEvent(timerCompleteEvent.type, timerCompleteEvent);
            }
        }, this.delay, this);
        this.running = true;
    }
};

Timer.prototype.reset = function () {
    if (this.running) {
        this.stop();
    }
    this.currentCount = 0;
}

Timer.prototype.stop = function () {
    if (this.running && this._intervalID) {
        clearTimeout(this._intervalID);
        this.running = false;
    }
};




var util = require("util");
var Event = require('../events/Event');
var EventDispatcher = require('../events/EventDispatcher');

module.exports = Timer;


util.inherits(Timer, EventDispatcher); //extends EventDispatcher
function Timer(delay, repeatCount)
{
    Timer.super_.call(this);
    this.currentCount = 0;
    this.delay = 0;
    this.repeatCount = repeatCount || 0;
    this.running = false;
    this._intervalID = null;
}

Timer.prototype.start = function () {
    if (this.running = false) {
        this._intervalID = setInterval(function(that){
            that.currentCount++;
            that.emit('timer');
            if(that.currentCount === that.repeatCount) {
                var timerEvent = new TimerEvent('timerComplete');
                that.dispatchEvent(timerEvent.type, timerEvent);
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
    }
};

function TimerEvent(type) // extends Event
{
    this.type = type;
}


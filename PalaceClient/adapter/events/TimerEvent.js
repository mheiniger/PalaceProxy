module.exports = TimerEvent;
module.exports.TIMER = 'timer';
module.exports.TIMER_COMPLETE = 'timerComplete';

function TimerEvent(type)
{
    this.type = type;
}


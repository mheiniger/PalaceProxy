Timer = require('../../PalaceClient/adapter/utils/Timer');
TimerEvent = require('../../PalaceClient/adapter/events/TimerEvent');
assert = require('assert');
util = require('util');

var result = {};
result.numberOfCalls = 0;
result.resetted = false;

console.log('starting tests');

timer = new Timer(100, 4);

// count number of calls:
timer.on(TimerEvent.TIMER, function () {
    result.numberOfCalls++;
    // test the reset() function by resetting the timer after 2 calls:
    if (result.numberOfCalls == 2 && result.resetted === false) {
        result.resetted = true;
        timer.reset();
        timer.start();
    }
    util.print('.');
});

// when finnished, stop the timer, get
timer.on(TimerEvent.TIMER_COMPLETE, function() {
    result.endTime = new Date().getTime();
    assert.equal(result.numberOfCalls, 6, 'Timer should be called 6 times, but is called ' + result.numberOfCalls + ' times');
    var timeUsed = result.endTime - result.startTime;
    assert.equal(timeUsed > 500 && timeUsed < 601, true, 'Used time should be 400 but is ' + timeUsed);
    console.log('tests ok');
});

result.startTime = new Date().getTime();
timer.start();
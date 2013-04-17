var eventEmitter = require('events').EventEmitter;

function Event() // extends Event
{
    this.emit = function(){
        console.log('emitted!');
    }

    this.Event = function ()
    {
        eventEmitter.emit();
        console.log('emitted!');
    }
}

module.exports = Event;
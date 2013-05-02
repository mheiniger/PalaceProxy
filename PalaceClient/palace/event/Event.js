var eventEmitter = require('events').EventEmitter;

function Event(name) // extends Event
{
    this.name = name;

    this.emit = function(){
        console.log('emitted!');
        eventEmitter.emit();
    }
}

module.exports = Event;
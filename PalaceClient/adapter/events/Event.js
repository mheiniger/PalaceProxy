module.exports = Event;
module.exports.COMPLETE = "complete";

function Event(type) // extends Event
{
    this.type = type;
}


var eventEmitter = require('events').EventEmitter;
//	import flash.events.Event;
	
	function PalaceEvent() // extends Event
	{
		this.ROOM_CHANGED/* :String */ = "roomChanged";
		
		this.CONNECT_START/* :String */ = "connectStart";
		this.CONNECT_COMPLETE/* :String */ = "connectComplete";
		this.CONNECT_FAILED/* :String */ = "connectFailed";
		this.DISCONNECTED/* :String */ = "disconnected";
		this.GOTO_URL/* :String */ = "gotoURL";
		this.AUTHENTICATION_REQUESTED/* :String */ = "authenticationRequested";
		this.ESP_CHANGED/* :String */ = "espChanged";
		
		this.text/* :String */;
		this.url/* :String */;

        this.emit = function(){
            console.log('emitted!');
        }

		this.PalaceEvent = function (type/* :String */, bubbles, cancelable)
		{
			bubbles = bubbles || false;
            cancelable = cancelable || false;
            eventEmitter.emit(type, bubbles, cancelable);
		}
	}

module.exports = PalaceEvent;
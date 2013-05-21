/*
 This file is part of OpenPalace.

 OpenPalace is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 OpenPalace is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with OpenPalace.  If not, see <http://www.gnu.org/licenses/>.
 */

//package net.codecomposer.palace.event
//{
var Event = require("./../../adapter/events/Event"); //	import flash.events.Event;
var util = require("util");

//	import net.codecomposer.palace.model.PalaceLooseProp;
//	import net.codecomposer.palace.model.PalaceUser;

module.exports = PalaceRoomEvent;
module.exports.USER_ENTERED/* :String */ = "userEntered";
module.exports.USER_LEFT/* :String */ = "userLeft";
module.exports.ROOM_CLEARED/* :String */ = "roomCleared";
module.exports.LOOSE_PROP_ADDED/* :String */ = "loosePropAdded";
module.exports.LOOSE_PROP_REMOVED/* :String */ = "loosePropRemoved";
module.exports.LOOSE_PROP_MOVED/* :String */ = "loosePropMoved";
module.exports.LOOSE_PROPS_CLEARED/* :String */ = "loosePropsCleared";
module.exports.USER_MOVED/* :String */ = "userMoved";
module.exports.USER_FACE = "userFace";
module.exports.SELECTED_USER_CHANGED/* :String */ = "selectedUserChanged";

util.inherits(PalaceRoomEvent, Event);
function PalaceRoomEvent(type/* :String */, user/* :PalaceUser  = null*/) //extends Event
{

    this.user = user || null/* :PalaceUser */;
    var propIndex = this.propIndex/* :int */;
    var looseProp = this.looseProp/* :PalaceLooseProp */;
    var addToFront = this.addToFront/* :Boolean */;

    PalaceRoomEvent.super_.call(this, type);

}
//}

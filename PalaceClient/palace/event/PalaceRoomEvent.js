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
//	import flash.events.Event;

//	import net.codecomposer.palace.model.PalaceLooseProp;
//	import net.codecomposer.palace.model.PalaceUser;

function PalaceRoomEvent() //extends Event
{
    this.constants = {};
    var user = this.user/* :PalaceUser */;
    var propIndex = this.propIndex/* :int */;
    var looseProp = this.looseProp/* :PalaceLooseProp */;
    var addToFront = this.addToFront/* :Boolean */;

    var USER_ENTERED = this.constants.USER_ENTERED/* :String */ = "userEntered";
    var USER_LEFT = this.constants.USER_LEFT/* :String */ = "userLeft";
    var ROOM_CLEARED = this.constants.ROOM_CLEARED/* :String */ = "roomCleared";
    var LOOSE_PROP_ADDED = this.constants.LOOSE_PROP_ADDED/* :String */ = "loosePropAdded";
    var LOOSE_PROP_REMOVED = this.constants.LOOSE_PROP_REMOVED/* :String */ = "loosePropRemoved";
    var LOOSE_PROP_MOVED = this.constants.LOOSE_PROP_MOVED/* :String */ = "loosePropMoved";
    var LOOSE_PROPS_CLEARED = this.constants.LOOSE_PROPS_CLEARED/* :String */ = "loosePropsCleared";
    var USER_MOVED = this.constants.USER_MOVED/* :String */ = "userMoved";
    var SELECTED_USER_CHANGED = this.constants.SELECTED_USER_CHANGED/* :String */ = "selectedUserChanged";

    var PalaceRoomEvent = this.PalaceRoomEvent = function (type/* :String */, user/* :PalaceUser  = null*/) {
        this.user = user || null;
        //super(type, false, false);
    }

}
//}

module.exports = PalaceRoomEvent;
var PalaceRoomEventVar = new PalaceRoomEvent();
for (name in PalaceRoomEventVar.constants) {
    module.exports[name] = PalaceRoomEventVar.constants[name];
}
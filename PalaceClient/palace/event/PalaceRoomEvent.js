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
var constants = {};

var USER_ENTERED = constants.USER_ENTERED/* :String */ = "userEntered";
var USER_LEFT = constants.USER_LEFT/* :String */ = "userLeft";
var ROOM_CLEARED = constants.ROOM_CLEARED/* :String */ = "roomCleared";
var LOOSE_PROP_ADDED = constants.LOOSE_PROP_ADDED/* :String */ = "loosePropAdded";
var LOOSE_PROP_REMOVED = constants.LOOSE_PROP_REMOVED/* :String */ = "loosePropRemoved";
var LOOSE_PROP_MOVED = constants.LOOSE_PROP_MOVED/* :String */ = "loosePropMoved";
var LOOSE_PROPS_CLEARED = constants.LOOSE_PROPS_CLEARED/* :String */ = "loosePropsCleared";
var USER_MOVED = constants.USER_MOVED/* :String */ = "userMoved";
var SELECTED_USER_CHANGED = constants.SELECTED_USER_CHANGED/* :String */ = "selectedUserChanged";


function PalaceRoomEvent(type/* :String */, user/* :PalaceUser  = null*/) //extends Event
{

    this.type = type;
    var user = this.user/* :PalaceUser */;
    var propIndex = this.propIndex/* :int */;
    var looseProp = this.looseProp/* :PalaceLooseProp */;
    var addToFront = this.addToFront/* :Boolean */;


    this.PalaceRoomEvent = function () {
        this.user = user || null;
        //super(type, false, false);
    }

}
//}

module.exports = PalaceRoomEvent;
for (name in constants) {
    module.exports[name] = constants[name];
}
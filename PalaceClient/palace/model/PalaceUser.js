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

//package net.codecomposer.palace.model
//{
//	import flash.events.Event;
//	import flash.events.EventDispatcher;

var	ArrayCollection = require("../../mx/collections/ArrayCollection");

//	import net.codecomposer.palace.event.PropEvent;
//	import net.codecomposer.palace.rpc.PalaceClient;

	/* \[Bindable\] */
	function PalaceUser() //extends EventDispatcher
	{
    this.constants = {};
		// wizard
		var SUPERUSER = this.constants.SUPERUSER/* :uint */ = 0x0001;
		
		// Total wizard
		var GOD = this.constants.GOD/* :uint */ = 0x0002;
		
		// Server should drop user at first opportunity
		var KILL = this.constants.KILL/* :uint */ = 0x0004;
		
		// user is a guest (no registration code)
		var GUEST = this.constants.GUEST/* :uint */ = 0x0008;
		
		// Redundant with KILL.  Shouldn't be used
		var BANISHED = this.constants.BANISHED/* :uint */ = 0x0010;
		
		// historical artifact.  Shouldn't be used
		var PENALIZED = this.constants.PENALIZED/* :uint */ = 0x0020;
		
		// Comm error, drop at first opportunity
		var COMM_ERROR = this.constants.COMM_ERROR/* :uint */ = 0x0040;
		
		// Not allowed to speak
		var GAG = this.constants.GAG/* :uint */ = 0x0080;
		
		// Stuck in corner and not allowed to move
		var PIN = this.constants.PIN/* :uint */ = 0x0100;
		
		// Doesn't appear on user list
		var HIDE = this.constants.HIDE/* :uint */ = 0x0200;
		
		// Not accepting whisper from outside room
		var REJECT_ESP = this.constants.REJECT_ESP/* :uint */ = 0x0400;
		
		// Not accepting whisper from inside room
		var REJECT_PRIVATE = this.constants.REJECT_PRIVATE/* :uint */ = 0x0800;
		
		// Not allowed to wear props
		var PROPGAG = this.constants.PROPGAG/* :uint */ = 0x1000;
		
		
		var isSelf = this.isSelf/* :Boolean */ = false;
		var id = this.id/* :int */;
		var name = this.name/* :String */ = "Uninitialized User";
		var x = this.x/* :int */;
		var y = this.y/* :int */;
		var roomID = this.roomID/* :int */;
		var roomName = this.roomName/* :String */;
		var propCount = this.propCount/* :int */;
		var _face/* :int */ = 1;
		var color = this.color/* :int */ = 2;
		var flags = this.flags/* :int */ = 0;
		var propIds = this.propIds/* :Array */ = [];
		var propCrcs = this.propCrcs/* : Array */ = [];
		var props = this.props/* :Array Collection */ = new ArrayCollection();
		
		var showFace = this.showFace/* :Boolean */ = true;
// todo: mhe: implement propstore
//		var propStore/* :PalaceProp Store */ = PalacePropStore.getInstance();
		
//		[Bindable(event="faceChanged")]
		var set_face = this.set_face = function(newValue/* :int */)/* :void */ {
			if (newValue > 12) {
				newValue = 0;
			}
			newValue = Math.max(0, newValue);
			if (_face != newValue) {
				_face = newValue;
				dispatchEvent(new Event("faceChanged"));
			}
		}
		var get_face = this.get_face = function()/* :int */ {
			return _face;
		}
		
		
		function filterBadProps(object/* :Object */)/* :Boolean */ {
			var prop/* :PalaceProp */ = PalaceProp(object);
			return !prop.badProp;
		}
		
		var PalaceUser = this.PalaceUser = function()
		{
			props.filterFunction = filterBadProps;
			props.refresh();
		}
		
		var get_isWizard = this.get_isWizard = function()/* :Boolean */ {
			return Boolean((flags & SUPERUSER) > 0);
		}
		
		var get_isGod = this.get_isGod = function()/* :Boolean */ {
			return Boolean((flags & GOD) > 0);
		}
		
		var get_isGuest = this.get_isGuest = function()/* :Boolean */ {
			return Boolean((flags & GUEST) > 0);
		}
		
		var toggleProp = this.toggleProp = function(prop/* :PalaceProp */)/* :void */ {
			var wearingProp/* :Boolean */ = (props.getItemIndex(prop) != -1);
			if (wearingProp) {
				removeProp(prop);
			}
			else {
				wearProp(prop);
			}
		}
		
		var wearProp = this.wearProp = function(prop/* :PalaceProp */)/* :void */ {
			prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
			if (props.length < 9 && props.getItemIndex(prop) == -1) {
				props.addItem(prop);
			}
			syncPropIdsToProps();
			checkFaceProps();
			updatePropsOnServer();
		}
		
		var setProps = this.setProps = function(props/* :Vector.<PalaceProp> */)/* :void */ {
			this.props.removeAll();
			for (var prop/* :PalaceProp */ in props) {
				// Fixing a bug where if you specified the same prop multiple
				// times in a SETPROPS command, you wouldn't ever be able to
				// remove the duplicate prop.  So we ignore any duplicate props
				// when adding them.
				if (this.props.getItemIndex(prop) == -1 && this.props.length < 9) {
					prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
					this.props.addItem(prop);
				}
			}
			syncPropIdsToProps();
			checkFaceProps();
			updatePropsOnServer();
		}
		
		var removeProp = this.removeProp = function(prop/* :PalaceProp */)/* :void */ {
			var propIndex/* :int */ = props.getItemIndex(prop);
			if (propIndex != -1) {
				props.removeItemAt(propIndex);
			}
			syncPropIdsToProps();
			checkFaceProps();
			updatePropsOnServer();
		}
		
		var updatePropsOnServer = this.updatePropsOnServer = function()/* :void */ {
			PalaceClient.getInstance().updateUserProps();
		}
		
		var naked = this.naked = function()/* :void */ {
			props.removeAll();
			syncPropIdsToProps();
			checkFaceProps();
			updatePropsOnServer();
		}
		
		var syncPropIdsToProps = this.syncPropIdsToProps = function()/* :void */ {
			propCount = props.length;
			propIds = [];
			propCrcs = [];
			for (var prop/* :PalaceProp */ in props) {
				propIds.push(prop.asset.id);
				propCrcs.push(prop.asset.crc);
			}
		}
		
		var loadProps = this.loadProps = function()/* :void */ {
// todo mhe: later
//			var i/* :int */ = 0;
//			var prop/* :PalaceProp */;
//			for (i=0; i < props.length; i++) {
//				prop = PalaceProp(props.getItemAt(i));
//				prop.removeEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
//			}
//			props.removeAll();
//			for (i = 0; i < propCount; i ++) {
//				prop = propStore.getProp(null, propIds[i], propCrcs[i]);
//				if (!prop.ready) {
//					prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
//				}
//				props.addItem(prop);
//			}
//			checkFaceProps();
		}
		
		function handlePropLoaded(event/* :PropEvent */)/* :void */ {
			checkFaceProps();
		}
		
		function checkFaceProps()/* :void */ {
			var showFace/* :Boolean */ = true;
			for (var i/* :int */ = 0; i < props.length; i ++) {
				var prop/* :PalaceProp */ = PalaceProp(props.getItemAt(i));
				if (prop.head) {
					showFace = false;
				}
			}
			this.showFace = showFace;
		}

	}
//}

module.exports = PalaceUser;
var PalaceUserVar = new PalaceUser();
for (name in PalaceUserVar.constants) {
   module.exports[name] = PalaceUserVar.constants[name];
}
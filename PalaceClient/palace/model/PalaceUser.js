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
var util = require("util");

var Event = require("../../adapter/events/Event");
var EventDispatcher = require("../../adapter/events/EventDispatcher");
var ArrayCollection = require("../../adapter/collections/ArrayCollection");

var PropEvent = require("./../event/PropEvent");
//	import net.codecomposer.palace.rpc.PalaceClient;

module.exports = PalaceUser;
// wizard
module.exports.SUPERUSER/* :uint */ = 0x0001;
// Total wizard
module.exports.GOD/* :uint */ = 0x0002;
// Server should drop user at first opportunity
module.exports.KILL/* :uint */ = 0x0004;
// user is a guest (no registration code)
module.exports.GUEST/* :uint */ = 0x0008;
// Redundant with KILL.  Shouldn't be used
module.exports.BANISHED/* :uint */ = 0x0010;
// historical artifact.  Shouldn't be used
module.exports.PENALIZED/* :uint */ = 0x0020;
// Comm error, drop at first opportunity
module.exports.COMM_ERROR/* :uint */ = 0x0040;
// Not allowed to speak
module.exports.GAG/* :uint */ = 0x0080;
// Stuck in corner and not allowed to move
module.exports.PIN/* :uint */ = 0x0100;
// Doesn't appear on user list
module.exports.HIDE/* :uint */ = 0x0200;
// Not accepting whisper from outside room
module.exports.REJECT_ESP/* :uint */ = 0x0400;
// Not accepting whisper from inside room
module.exports.REJECT_PRIVATE/* :uint */ = 0x0800;
// Not allowed to wear props
module.exports.PROPGAG/* :uint */ = 0x1000;


util.inherits(PalaceUser, EventDispatcher); //extends EventDispatcher
function PalaceUser()
{
    PalaceUser.super_.call(this);

    var that = this;

    this.isSelf/* :Boolean */ = false;
    this.id/* :int */ = 0;
    this.name/* :String */ = "Uninitialized User";
    this.x/* :int */ = 0;
    this.y/* :int */ = 0;
    this.roomID/* :int */ = 0;
    this.roomName/* :String */ = "";
    this.propCount/* :int */ = 0;
    var _face/* :int */ = 1;
    this.color/* :int */ = 2;
    this.flags/* :int */ = 0;
    this.propIds/* :Array */ = [];
    this.propCrcs/* : Array */ = [];
    this.props/* :Array Collection */ = new ArrayCollection();

    this.showFace/* :Boolean */ = true;
// todo: mhe: implement prop store
//		var propStore/* :PalaceProp Store */ = PalacePropStore.getInstance();

    this.set_face = function (newValue/* :int */)/* :void */ {
        if (newValue > 12) {
            newValue = 0;
        }
        newValue = Math.max(0, newValue);
        if (_face != newValue) {
            _face = newValue;
            dispatchEvent(new Event("faceChanged"));
        }
    };

    this.set_color = function(newValue) {
        if (that.color != newValue) {
            that.color = newValue;
            dispatchEvent(new Event("faceChanged"));
        }
    };

    this.get_face = function ()/* :int */ {
        return _face;
    };


    function filterBadProps(object/* :Object */)/* :Boolean */ {
        var prop/* :PalaceProp */ = PalaceProp(object);
        return !prop.badProp;
    }

    this.PalaceUserConstructor = function () {
        that.props.filterFunction = filterBadProps;
        that.props.refresh();
    };

    this.get_isWizard = function ()/* :Boolean */ {
        return Boolean((that.flags & module.exports.SUPERUSER) > 0);
    };

    this.get_isGod = function ()/* :Boolean */ {
        return Boolean((that.flags & module.exports.GOD) > 0);
    };

    this.get_isGuest = function ()/* :Boolean */ {
        return Boolean((that.flags & module.exports.GUEST) > 0);
    };

    this.toggleProp = function (prop/* :PalaceProp */)/* :void */ {
        var wearingProp/* :Boolean */ = (that.props.getItemIndex(prop) != -1);
        if (wearingProp) {
            that.removeProp(prop);
        }
        else {
            that.wearProp(prop);
        }
    };

    this.wearProp = function (prop/* :PalaceProp */)/* :void */ {
        prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
        if (that.props.length < 9 && that.props.getItemIndex(prop) == -1) {
            that.props.addItem(prop);
        }
        that.syncPropIdsToProps();
        checkFaceProps();
        that.updatePropsOnServer();
    };

    this.setProps = function (props/* :Vector.<PalaceProp> */)/* :void */ {
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
        that.syncPropIdsToProps();
        checkFaceProps();
        that.updatePropsOnServer();
    };

    this.removeProp = function (prop/* :PalaceProp */)/* :void */ {
        var propIndex/* :int */ = that.props.getItemIndex(prop);
        if (propIndex != -1) {
            that.props.removeItemAt(propIndex);
        }
        that.syncPropIdsToProps();
        checkFaceProps();
        that.updatePropsOnServer();
    };

    this.updatePropsOnServer = function ()/* :void */ {
        PalaceClient.getInstance().updateUserProps();
    };

    this.naked = function ()/* :void */ {
        that.props.removeAll();
        that.syncPropIdsToProps();
        checkFaceProps();
        that.updatePropsOnServer();
    }

    this.syncPropIdsToProps = function ()/* :void */ {
        that.propCount = that.props.length;
        that.propIds = [];
        that.propCrcs = [];
        for (var prop/* :PalaceProp */ in that.props) {
            that.propIds.push(prop.asset.id);
            that.propCrcs.push(prop.asset.crc);
        }
    };

    this.loadProps = function ()/* :void */ {
// todo mhe: later
//			var i/* :int */ = 0;
//			var prop/* :PalaceProp */;
//			for (i=0; i < that.props.length; i++) {
//				prop = PalaceProp(that.props.getItemAt(i));
//				prop.removeEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
//			}
//			that.props.removeAll();
//			for (i = 0; i < that.propCount; i ++) {
//				prop = that.propStore.getProp(null, that.propIds[i], that.propCrcs[i]);
//				if (!prop.ready) {
//					prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
//				}
//				that.props.addItem(prop);
//			}
//			checkFaceProps();
    };

    function handlePropLoaded(event/* :PropEvent */)/* :void */ {
        checkFaceProps();
    }

    function dispatchEvent(event) {
        event.user = that;
        event.user.face = that.get_face();
        that.dispatchEvent(event.type, event);
    }

    function checkFaceProps()/* :void */ {
        var showFace/* :Boolean */ = true;
        for (var i/* :int */ = 0; i < that.props.length; i++) {
            var prop/* :PalaceProp */ = PalaceProp(that.props.getItemAt(i));
            if (prop.head) {
                showFace = false;
            }
        }
        that.showFace = showFace;
    }

}

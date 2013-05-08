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
var util = require("util");

var Event = require('./../event/Event');
var EventDispatcher = require('./../event/EventDispatcher');

var Point = require("./Point");
//	import flash.utils.ByteArray;
var ByteArray = Buffer;

var	ArrayCollection = require("../../mx/collections/ArrayCollection");
var PalaceHotspotState = require("./PalaceHotspotState");
var FlexPoint = require("./FlexPoint");
var PalaceClient = require("../../PalaceClient");


//	import net.codecomposer.palace.event.HotspotEvent;
//	import net.codecomposer.palace.iptscrae.IptEventHandler;
//	import net.codecomposer.palace.iptscrae.PalaceIptManager;
//	import net.codecomposer.palace.rpc.PalaceClient;

//	import org.openpalace.iptscrae.IptTokenList;

//	[Event(name="stateChanged",type="net.codecomposer.palace.event.HotspotEvent")]
//	[Event(name="moved",type="net.codecomposer.palace.event.HotspotEvent")]
var constants = {};

var TYPE_NORMAL = constants.TYPE_NORMAL/* :int */ = 0;
var TYPE_PASSAGE = constants.TYPE_PASSAGE/* :int */ = 1;
var TYPE_SHUTABLE_DOOR = constants.TYPE_SHUTABLE_DOOR/* :int */ = 2;
var TYPE_LOCKABLE_DOOR = constants.TYPE_LOCKABLE_DOOR/* :int */ = 3;
var TYPE_BOLT = constants.TYPE_BOLT/* :int */ = 4;
var TYPE_NAVAREA = constants.TYPE_NAVAREA/* :int */ = 5;

var STATE_UNLOCKED = constants.STATE_UNLOCKED/* :int */ = 0;
var STATE_LOCKED = constants.STATE_LOCKED/* :int */ = 1;

var FLAG_SHOW_NAME = constants.FLAG_SHOW_NAME/* :int */ = 0x08;
var FLAG_DONT_MOVE_HERE = constants.FLAG_DONT_MOVE_HERE/* :int */ = 0x02;
var FLAG_DRAGGABLE = constants.FLAG_DRAGGABLE/* :int */ = 0x01;
var FLAG_INVISIBLE = constants.FLAG_INVISIBLE/* :int */ = 0x04;
var FLAG_DRAW_FRAME = constants.FLAG_DRAW_FRAME/* :int */ = 0x10;
var FLAG_SHADOW = constants.FLAG_SHADOW/* :int */ = 0x20;
var FLAG_FILL = constants.FLAG_FILL/* :int */ = 0x40;


//		PicturesAboveAll        0x00000001        /* was "Draggable" */
//		DontMoveHere            0x00000002
//		PicturesAboveProps        0x00000004        /* was "Invisible" */
//		ShowName                0x00000008
//		ShowFrame                0x00000010
//		Shadow                    0x00000020
//		PicturesAboveNameTags    0x00000040        /* was "Fill" */
//		Forbidden                0x00000080        /* Linux 4.5.1 PServer */
//		Mandatory                0x00000100        /* Linux 4.5.1 PServer */
//		Landingpad                0x00000200        /* Linux 4.5.1 PServer */

// Hotspot records are 48 bytes
var size = constants.size /* :int */ = 48;


/* \[Bindable\] */
function PalaceHotspot() //extends EventDispatcher
{
    EventDispatcher.call(this);


    var type = this.type/* :int */ = 0;
    var dest = this.dest/* :int */ = 0;
    var _id/* :int */ = 0;
    var _flags/* :int */ = 0;
    var state = this.state/* :int */ = 0;
    var numStates = this.numStates/* :int */ = 0;
    var polygon = this.polygon/* :Array */ = []; // Array of points
    var _name/* :String */ = null;
    var location = this.location/* :FlexPoint */;
    var scriptEventMask = this.scriptEventMask/* :int */ = 0;
    var nbrScripts = this.nbrScripts/* :int */ = 0;
    var scriptString = this.scriptString/* :String */ = "";
    var scriptCursor = this.scriptCursor/* :int */ = 0;
    var ungetFlag/* :Boolean */ = false;
    var gToken/* :String */;
    var secureInfo = this.secureInfo/* :int */;
    var refCon = this.refCon/* :int */;
    var groupId = this.groupId/* :int */;
    var scriptRecordOffset = this.scriptRecordOffset/* :int */;
    var states = this.states/* :Array Collection */ = new ArrayCollection();
    var eventHandlers = this.eventHandlers= {};

//		[Bindable('idChanged')]
    var set_id = this.set_id = function(newValue/* :int */)/* :void */ {
        if (_id != newValue) {
            _id = newValue;
            dispatchEvent(new Event('idChanged'));
        }
    }
    var get_id = this.get_id = function()/* :int */ {
        return _id;
    }

//		[Bindable('nameChanged')]
    var set_name = this.set_name = function(newValue/* :String */)/* :void */ {
        if (_name != newValue) {
            _name = newValue;
            dispatchEvent(new Event('nameChanged'));
        }
    }
    var get_name = this.get_name = function()/* :String */ {
        return _name;
    }

//		[Bindable('flagsChanged')]
    var set_flags = this.set_flags = function(newValue/* :int */)/* :void */ {
        _flags = newValue;
        dispatchEvent(new Event('flagsChanged'));
    }
    var get_flags = this.get_flags = function()/* :int */ {
        return _flags;
    }

    var get_label = this.get_label = function()/* :String */ {
        var string/* :String */ = "id " + id.toString() + ": ";
        string += (name) ? name : "(no name)";
//			trace(string);
        return string;
    }

//		[Bindable('flagsChanged')]
    var get_showName = this.get_showName = function()/* :Boolean */ {
        return Boolean(flags & FLAG_SHOW_NAME);
    }

//		[Bindable('flagsChanged')]
    var get_dontMoveHere = this.get_dontMoveHere = function()/* :Boolean */ {
        return Boolean(flags & FLAG_DONT_MOVE_HERE);
    }

//		[Bindable('flagsChanged')]
    var get_draggable = this.get_draggable = function()/* :Boolean */ {
        return Boolean(flags & FLAG_DRAGGABLE);
    }

//		[Bindable('flagsChanged')]
    var get_drawFrame = this.get_drawFrame = function()/* :Boolean */ {
        return Boolean(flags & FLAG_DRAW_FRAME);
    }

//		[Bindable('flagsChanged')]
    var get_shadow = this.get_shadow = function()/* :Boolean */ {
        return Boolean(flags & FLAG_SHADOW);
    }

//		[Bindable('flagsChanged')]
    var get_fill = this.get_fill = function()/* :Boolean */ {
        return Boolean(flags & FLAG_FILL);
    }

//		[Bindable('flagsChanged')]
    var get_invisible = this.get_invisible = function()/* :Boolean */ {
        return Boolean(flags & FLAG_INVISIBLE);
    }

//		[Bindable('flagsChanged')]
    var get_layerAboveAll = this.get_layerAboveAll = function()/* :Boolean */ {
        return draggable;
    }

//		[Bindable('flagsChanged')]
    var get_layerAboveAvatars = this.get_layerAboveAvatars = function()/* :Boolean */ {
        return invisible;
    }

//		[Bindable('flagsChanged')]
    var get_layerAboveNameTags = this.get_layerAboveNameTags = function()/* :Boolean */ {
        return fill;
    }

//		[Bindable('flagsChanged')]
    var get_layerNormal = this.get_layerNormal = function()/* :Boolean */ {
        return (!draggable && !invisible && !fill);
    }

    this.constructor = function () {
    }();

    var get_isDoor = this.get_isDoor = function()/* :Boolean */ {
        return Boolean(type == TYPE_PASSAGE ||
            type == TYPE_LOCKABLE_DOOR ||
            type == TYPE_SHUTABLE_DOOR);
    }

    var changeState = this.changeState = function(newState/* :int */)/* :void */ {
        var previousState/* :int */ = state;
        if (newState != state) {
            state = newState;
        }
        var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.STATE_CHANGED);
        event.state = state;
        event.previousState = previousState;
        dispatchEvent(event);
    }

    var movePicForState = this.movePicForState = function(stateId/* :int */, x/* :int */, y/* :int */)/* :void */ {
        try {
            if (stateId < 0) {
                stateId = this.state;
            }
            var stateObj/* :PalaceHotspotState */ = PalaceHotspotState(states.getItemAt(stateId));
            stateObj.x = x;
            stateObj.y = y;
            var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.MOVED);
            dispatchEvent(event);
        }
        catch (e/* :Error */) {
            // do nothing.
        }
    }

    var movePicTo = this.movePicTo = function(x/* :int */, y/* :int */)/* :void */ {
        movePicForState(this.state, x, y);
    }

    var setStateOpacity = this.setStateOpacity = function(state/* :int */, opacity/* :Number = 1*/ )/* :void */ {
        opacity = opacity || 1;
        try {
            if (state < 0) {
                state = this.state;
            }
            var stateObj/* :PalaceHotspotState */ = PalaceHotspotState(states.getItemAt(state));
            if (stateObj) {
                stateObj.opacity = opacity;
                var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.OPACITY_CHANGED);
                event.state = state;
                dispatchEvent(event);
            }
        }
        catch (e/* :Error */) {
            // do nothing.
        }
    }

    var moveTo = this.moveTo = function(x/* :int */, y/* :int */)/* :void */ {
        location.x = x;
        location.y = y;
        var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.MOVED);
        dispatchEvent(event);
    }

    function trace(text) {
        console.log(text);
    }

    var readData = this.readData = function(endian/* :String */, roomBytes/* :Array */, offset/* :int */)/* :void */ {
//			trace("Hotspot offset " + offset);
        location = new FlexPoint();

        var ba/* :ByteArray */ = new ByteArray(size+1);
        for (var j/* :int */ = offset; j < offset + size; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;
//        outputHexView(ba);
        scriptEventMask = ba.readInt();
        flags = ba.readInt();
//			trace("Hotspot Flags: 0x" + flags.toString(16));
        secureInfo = ba.readInt();
        refCon = ba.readInt();
        location.y = ba.readShort();
        location.x = ba.readShort();
//			trace("Location X: " + location.x + " - Location Y: " + location.y);
        id = ba.readShort();
        dest = ba.readShort();
        var numPoints/* :int */ = ba.readShort();
//			trace("Number points: " + numPoints);
        var pointsOffset/* :int */ = ba.readShort();
//			trace("Points offset: " + pointsOffset);
        type = ba.readShort();
        groupId = ba.readShort();
        nbrScripts = ba.readShort();
        scriptRecordOffset = ba.readShort();
        state = ba.readShort();
        numStates = ba.readShort();
        var stateRecordOffset/* :int */ = ba.readShort();
        var nameOffset/* :int */ = ba.readShort();
        var scriptTextOffset/* :int */ = ba.readShort();
        ba.readShort();
        if (nameOffset > 0) {
            var nameLength/* :int */ = roomBytes[nameOffset] || 0;
//            trace("nameoffset: "+ nameOffset + "nameLength:" + nameLength);
            var nameByteArray/* :ByteArray */ = new ByteArray(nameLength);
            for (var a/* :int */ = nameOffset+1; a < nameOffset+nameLength+1; a++) {
                nameByteArray.writeByte(roomBytes[a]);
            }
            nameByteArray.position = 0;
            name = nameByteArray.readMultiByte(nameLength, 'Windows-1252');
        }
        else {
            name = "";
        }
        trace("Hotspot name: " + name);

        // Script...
//        if (scriptTextOffset > 0) {
//            var currentByte/* :int */ = -1;
//            var counter/* :int */ = scriptTextOffset;
//            var maxLength/* :int */ = roomBytes.length;
//            trace("scriptTextOffset:" + (maxLength - scriptTextOffset));
//            var scriptByteArray/* :ByteArray */ = new ByteArray(maxLength - scriptTextOffset);
//            var scriptChars/* :int */ = 0;
//            while (currentByte != 0 && counter < maxLength) {
//                scriptByteArray.writeByte(roomBytes[counter++]);
//                scriptChars ++;
//            }
//            scriptByteArray.position = 0;
//            scriptString = scriptByteArray.readMultiByte(scriptChars, 'Windows-1252');
//        }
//			trace("Script: " + scriptString);
        //loadScripts();
        var endPos/* :int */ = pointsOffset+(numPoints*4);
//        trace("pointsOffset:" + (pointsOffset));
        ba = new ByteArray(endPos + 1 - pointsOffset);
//        for (j=pointsOffset; j < endPos+1; j++) {
//            ba.writeByte(roomBytes[j]);
//        }
        roomBytes.copy(ba, 0, pointsOffset, endPos+1);

//        outputHexView(ba);
//        console.log(ba);
        ba.position = 0;
        ba.endian = endian;

        // Get vertices
        var startX/* :int */ = 0;
        var startY/* :int */ = 0;
        for (var i/* :int */ = 0; i < numPoints; i++) {
            var y/* :int */ = ba.readShort();
            var x/* :int */ = ba.readShort();
//            trace("----- X: " + x + " (" + (x).toString(16) + ")    Y: " + y + "(" + (y).toString(16) +")");
            polygon.push(new Point(x, y));
        }

        // Get States
        states.removeAll();
        var stateOffset/* :int */ = stateRecordOffset;
        for (i=0; i < numStates; i++) {
            var state/* :PalaceHotspotState */ = new PalaceHotspotState();
            state.readData(endian, roomBytes, stateOffset);
            stateOffset += PalaceHotspotState.size;
            states.addItem(state);
        }

    		//	trace("Got new hotspot: " + id + " - DestID: " + dest + " - name: '" + name + "' - PointCount: " + numPoints);
    }

    var hasEventHandler = this.hasEventHandler = function(eventType/* :int */)/* :Boolean */ {
        return (nbrScripts > 0 && (scriptEventMask & 1 << eventType) != 0);
    }

    var getEventHandler = this.getEventHandler = function(eventType/* :int */)/* :IptTokenList */ {
        if(nbrScripts > 0 && (scriptEventMask & 1 << eventType) != 0)
        {
            for(var i/* :int */ = 0; i < nbrScripts; i++)
            {
                var eventHandler/* :IptEventHandler */ = eventHandlers[i];
                if (eventHandler.eventType == eventType) {
                    return eventHandler.tokenList;
                }
            }

        }
        return null;
    }

    function outputHexView(bytes) {
        var output = "";
        var outputLineHex = "";
        var outputLineAscii = "";
        for (var byteNum = 0; byteNum < bytes.length; byteNum++) {
            var hexNum = (bytes[byteNum]).toString(16).toUpperCase();
            if (hexNum.length == 1) {
                hexNum = "0" + hexNum;
            }

            if (byteNum % 16 == 0) {
                output = output.concat(outputLineHex, "      ", outputLineAscii, "\n");
                outputLineHex = "";
                outputLineAscii = "";
            }
            else if (byteNum % 4 == 0) {
                outputLineHex = outputLineHex.concat("  ");
                outputLineAscii = outputLineAscii.concat(" ");
            }
            else {
                outputLineHex = outputLineHex.concat(" ");
            }
            outputLineHex = outputLineHex.concat(hexNum);
            outputLineAscii = outputLineAscii.concat(
                (bytes[byteNum] >= 32 && bytes[byteNum] <= 126) ? String.fromCharCode(bytes[byteNum]) : " "
            );
        }

        var bufferLength = 57 - outputLineHex.length;
        var bufferString = "";
        for (var i = 0; i < bufferLength; i++) {
            bufferString += " ";
        }

        output = output.concat(outputLineHex, bufferString, outputLineAscii, "\n");
        trace(output);
    }

    var loadScripts = this.loadScripts = function()/* :void */ {
        return; // TODO: send scripts to client
        nbrScripts = 0;
        scriptEventMask = 0;
        if(scriptString)
        {
//				trace("Hotspot " + id + " name: " + name + " script:\n" + scriptString);

            var manager/* :PalaceIptManager */ = PalaceClient.getInstance().palaceController.scriptManager;
            var foundHandlers/* :Object */ = manager.parseEventHandlers(scriptString);

            for (var eventName/* :String */ in foundHandlers) {
                var handler/* :IptTokenList */ = foundHandlers[eventName];
                var eventType/* :int */ = IptEventHandler.getEventType(eventName)
                var eventHandler/* :IptEventHandler */ =
                    new IptEventHandler(eventType, handler.sourceScript, handler);
                eventHandlers.push(eventHandler);
//					trace("Got event handler.  Type: " + eventHandler.eventType + " Script: \n" + eventHandler.script);
                nbrScripts ++;
                scriptEventMask |= (1 << eventType);
            }
        }
    }

}
//}
util.inherits(PalaceHotspot, EventDispatcher);

module.exports = PalaceHotspot;
var PalaceHotspotVar = new PalaceHotspot();
for (name in PalaceHotspotVar.constants) {
    module.exports[name] = PalaceHotspotVar.constants[name];
}
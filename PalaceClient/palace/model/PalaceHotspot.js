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

var Event = require('./../../adapter/events/Event');
var EventDispatcher = require('./../../adapter/events/EventDispatcher');

var Point = require("./Point");
//	import flash.utils.ByteArray;
var ByteArray = Buffer;

var ArrayCollection = require("../../adapter/collections/ArrayCollection");
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

module.exports = PalaceHotspot;

util.inherits(PalaceHotspot, EventDispatcher);

var TYPE_NORMAL = module.exports.TYPE_NORMAL/* :int */ = 0;
var TYPE_PASSAGE = module.exports.TYPE_PASSAGE/* :int */ = 1;
var TYPE_SHUTABLE_DOOR = module.exports.TYPE_SHUTABLE_DOOR/* :int */ = 2;
var TYPE_LOCKABLE_DOOR = module.exports.TYPE_LOCKABLE_DOOR/* :int */ = 3;
var TYPE_BOLT = module.exports.TYPE_BOLT/* :int */ = 4;
var TYPE_NAVAREA = module.exports.TYPE_NAVAREA/* :int */ = 5;

var STATE_UNLOCKED = module.exports.STATE_UNLOCKED/* :int */ = 0;
var STATE_LOCKED = module.exports.STATE_LOCKED/* :int */ = 1;

var FLAG_SHOW_NAME = module.exports.FLAG_SHOW_NAME/* :int */ = 0x08;
var FLAG_DONT_MOVE_HERE = module.exports.FLAG_DONT_MOVE_HERE/* :int */ = 0x02;
var FLAG_DRAGGABLE = module.exports.FLAG_DRAGGABLE/* :int */ = 0x01;
var FLAG_INVISIBLE = module.exports.FLAG_INVISIBLE/* :int */ = 0x04;
var FLAG_DRAW_FRAME = module.exports.FLAG_DRAW_FRAME/* :int */ = 0x10;
var FLAG_SHADOW = module.exports.FLAG_SHADOW/* :int */ = 0x20;
var FLAG_FILL = module.exports.FLAG_FILL/* :int */ = 0x40;


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
var size = module.exports.size /* :int */ = 48;


/* \[Bindable\] */
function PalaceHotspot() //extends EventDispatcher
{
    PalaceHotspot.super_.call(this);

    var that = this;

    // Hotspot records are 48 bytes
    this.size/* :int */ = size;

    this.type/* :int */ = 0;
    this.dest/* :int */ = 0;
    var _id/* :int */ = 0;
    var _flags/* :int */ = 0;
    this.state/* :int */ = 0;
    this.numStates/* :int */ = 0;
    this.polygon/* :Array */ = []; // Array of points
    var _name/* :String */ = null;
    this.location/* :FlexPoint */ = null;
    this.scriptEventMask/* :int */ = 0;
    this.nbrScripts/* :int */ = 0;
    this.scriptString/* :String */ = "";
    this.scriptCursor/* :int */ = 0;
    var ungetFlag/* :Boolean */ = false;
    var gToken/* :String */;
    this.secureInfo/* :int */ = 0;
    this.refCon/* :int */ = 0;
    this.groupId/* :int */ = 0;
    this.scriptRecordOffset/* :int */ = 0;
    this.states/* :Array Collection */ = new ArrayCollection();
    this.eventHandlers = [];

//		[Bindable('idChanged')]
    this.setId = function (newValue/* :int */)/* :void */ {
        if (_id != newValue) {
            _id = newValue;
            dispatchEvent(new Event('idChanged'));
        }
    };
    this.getId = function ()/* :int */ {
        return _id;
    };

    this.setName = function (newValue/* :String */)/* :void */ {
        if (_name != newValue) {
            _name = newValue;
            dispatchEvent(new Event('nameChanged'));
        }
    };

    this.getName = function ()/* :String */ {
        return _name;
    };

    this.setFlags = function (newValue/* :int */)/* :void */ {
        _flags = newValue;
        dispatchEvent(new Event('flagsChanged'));
    };

    this.getFlags = function ()/* :int */ {
        return _flags;
    };

    this.getLabel = function ()/* :String */ {
        var string/* :String */ = "id " + id.toString() + ": ";
        string += (that.getName()) ? that.getName() : "(no name)";
//			trace(string);
        return string;
    };

    this.getShowNameFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_SHOW_NAME);
    };

    this.getDontMoveHereFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_DONT_MOVE_HERE);
    };

    this.getDraggableFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_DRAGGABLE);
    };

    this.getDrawFrameFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_DRAW_FRAME);
    };

    this.getShadowFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_SHADOW);
    };

    this.getFillFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_FILL);
    };

    this.getInvisibleFlag = function ()/* :Boolean */ {
        return Boolean(that.getFlags() & FLAG_INVISIBLE);
    };

    this.getLayerAboveAllFlag = function ()/* :Boolean */ {
        return that.getDraggableFlag();
    };

    this.getLayerAboveAvatarsFlag = function ()/* :Boolean */ {
        return that.getInvisibleFlag();
    };

    this.getLayerAboveNameTagsFlag = function ()/* :Boolean */ {
        return that.getFillFlag();
    };

    this.getLayerNormalFlag = function ()/* :Boolean */ {
        return (!that.getDraggableFlag() && !that.getInvisibleFlag() && !that.getFillFlag());
    };

    this.getIsDoorFlag = function ()/* :Boolean */ {
        return Boolean(that.type == TYPE_PASSAGE ||
            that.type == TYPE_LOCKABLE_DOOR ||
            that.type == TYPE_SHUTABLE_DOOR);
    };

    this.changeState = function (newState/* :int */)/* :void */ {
        var previousState/* :int */ = that.state;
        if (newState != that.state) {
            that.state = newState;
        }
        var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.STATE_CHANGED);
        event.state = state;
        event.previousState = previousState;
        dispatchEvent(event);
    };

    this.movePicForState = function (stateId/* :int */, x/* :int */, y/* :int */)/* :void */ {
        try {
            if (stateId < 0) {
                stateId = that.state;
            }
            var stateObj/* :PalaceHotspotState */ = PalaceHotspotState(that.states.getItemAt(stateId));
            stateObj.x = x;
            stateObj.y = y;
            var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.MOVED);
            dispatchEvent(event);
        }
        catch (e/* :Error */) {
            // do nothing.
        }
    };

    this.movePicTo = function (x/* :int */, y/* :int */)/* :void */ {
        that.movePicForState(that.state, x, y);
    };

    this.setStateOpacity = function (state/* :int */, opacity/* :Number = 1*/)/* :void */ {
        opacity = opacity || 1;
        try {
            if (state < 0) {
                state = that.state;
            }
            var stateObj/* :PalaceHotspotState */ = PalaceHotspotState(that.states.getItemAt(state));
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
    };

    this.moveTo = function (x/* :int */, y/* :int */)/* :void */ {
        that.location.x = x;
        that.location.y = y;
        var event/* :HotspotEvent */ = new HotspotEvent(HotspotEvent.MOVED);
        dispatchEvent(event);
    };

    function trace(text) {
        console.log(text);
    }

    this.readData = function (endian/* :String */, roomBytes/* :Array */, offset/* :int */)/* :void */ {

			trace("Hotspot offset " + offset);
        that.location = new FlexPoint();

        var ba/* :ByteArray */ = new ByteArray(size + 1);
        for (var j/* :int */ = offset; j < offset + size; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;
//        outputHexView(ba);
        that.scriptEventMask = ba.readInt();
        that.setFlags(ba.readInt());
//			trace("Hotspot Flags: 0x" + flags.toString(16));
        that.secureInfo = ba.readInt();
        that.refCon = ba.readInt();
        trace('set location');
        that.location.y = ba.readShort();
        that.location.x = ba.readShort();
//			trace("Location X: " + that.location.x + " - Location Y: " + that.location.y);
        that.id = ba.readShort();
        that.dest = ba.readShort();
        var numPoints/* :int */ = ba.readShort();
//			trace("Number points: " + numPoints);
        var pointsOffset/* :int */ = ba.readShort();
//			trace("Points offset: " + pointsOffset);
        that.type = ba.readShort();
        that.groupId = ba.readShort();
        that.nbrScripts = ba.readShort();
        that.scriptRecordOffset = ba.readShort();
        state = ba.readShort();
        that.numStates = ba.readShort();
        var stateRecordOffset/* :int */ = ba.readShort();
        var nameOffset/* :int */ = ba.readShort();
        var scriptTextOffset/* :int */ = ba.readShort();
        ba.readShort();
        if (nameOffset > 0) {
            var nameLength/* :int */ = roomBytes[nameOffset] || 0;
//            trace("nameoffset: "+ nameOffset + "nameLength:" + nameLength);
            var nameByteArray/* :ByteArray */ = new ByteArray(nameLength);
            for (var a/* :int */ = nameOffset + 1; a < nameOffset + nameLength + 1; a++) {
                nameByteArray.writeByte(roomBytes[a]);
            }
            nameByteArray.position = 0;

            var name = nameByteArray.readMultiByte(nameLength, 'Windows-1252');
            that.setName(name);
        }
        else {
            that.setName("");
        }
        //trace("Hotspot name: " + name);

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
        var endPos/* :int */ = pointsOffset + (numPoints * 4);
//        trace("pointsOffset:" + (pointsOffset));
        ba = new ByteArray(endPos + 1 - pointsOffset);
//        for (j=pointsOffset; j < endPos+1; j++) {
//            ba.writeByte(roomBytes[j]);
//        }
        roomBytes.copy(ba, 0, pointsOffset, endPos + 1);

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
            that.polygon.push(new Point(x, y));
        }

        // Get States
        that.states.removeAll();
        var stateOffset/* :int */ = stateRecordOffset;
        for (i = 0; i < that.numStates; i++) {
            var state/* :PalaceHotspotState */ = new PalaceHotspotState();
            state.readData(endian, roomBytes, stateOffset);
            stateOffset += PalaceHotspotState.size;
            that.states.addItem(state);
        }

        //	trace("Got new hotspot: " + id + " - DestID: " + dest + " - name: '" + name + "' - PointCount: " + numPoints);
    };

    this.hasEventHandler = function (eventType/* :int */)/* :Boolean */ {
        return (that.nbrScripts > 0 && (that.scriptEventMask & 1 << eventType) != 0);
    };

    this.getEventHandler = function (eventType/* :int */)/* :IptTokenList */ {
        if (that.nbrScripts > 0 && (that.scriptEventMask & 1 << eventType) != 0) {
            for (var i/* :int */ = 0; i < that.nbrScripts; i++) {
                var eventHandler/* :IptEventHandler */ = that.eventHandlers[i];
                if (eventHandler.eventType == eventType) {
                    return eventHandler.tokenList;
                }
            }

        }
        return null;
    };

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

    this.loadScripts = function ()/* :void */ {
        return; // TODO: send scripts to client
        that.nbrScripts = 0;
        that.scriptEventMask = 0;
        if (that.scriptString) {
//				trace("Hotspot " + id + " name: " + name + " script:\n" + scriptString);

            var manager/* :PalaceIptManager */ = PalaceClient.getInstance().palaceController.scriptManager;
            var foundHandlers/* :Object */ = manager.parseEventHandlers(scriptString);

            for (var eventName/* :String */ in foundHandlers) {
                var handler/* :IptTokenList */ = foundHandlers[eventName];
                var eventType/* :int */ = IptEventHandler.getEventType(eventName)
                var eventHandler/* :IptEventHandler */ =
                    new IptEventHandler(eventType, handler.sourceScript, handler);
                that.eventHandlers.push(eventHandler);
//					trace("Got event handler.  Type: " + eventHandler.eventType + " Script: \n" + eventHandler.script);
                that.nbrScripts++;
                that.scriptEventMask |= (1 << eventType);
            }
        }
    };

    function dispatchEvent(object) {
        trace("dispatch event: " + object.type);
        that.dispatchEvent(object.type, object);
    }
}

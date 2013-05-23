var util = require("util");

var Event = require("../../adapter/events/Event");
var EventDispatcher = require("../../adapter/events/EventDispatcher");
var Point = require("../../palace/model/Point");
var ByteArray = Buffer;
var DrawColorUtil = require("../util/DrawColorUtil");
//	import flash.utils.Endian;

module.exports = PalaceDrawRecord;
var CMD_PATH = module.exports.CMD_PATH/* :uint */ = 0;
var CMD_SHAPE = module.exports.CMD_SHAPE/* :uint */ = 1;
var CMD_TEXT = module.exports.CMD_TEXT/* :uint */ = 2;
var CMD_DETONATE = module.exports.CMD_DETONATE/* :uint */ = 3;
var CMD_DELETE = module.exports.CMD_DELETE/* :uint */ = 4;
var CMD_ELLIPSE = module.exports.CMD_ELLIPSE/* :uint */ = 5;

var LAYER_BACK = module.exports.LAYER_BACK/* :uint */ = 0x00;
var LAYER_FRONT = module.exports.LAYER_FRONT/* :uint */ = 0x80;

var USE_FILL = module.exports.USE_FILL/* :uint */ = 0x01;
var IS_ELLIPSE = module.exports.IS_ELLIPSE/* :uint */ = 0x40;


/* \[Bindable\] */
util.inherits(PalaceDrawRecord, EventDispatcher); //extends EventDispatcher
function PalaceDrawRecord()
{
    PalaceDrawRecord.super_.call(this);

    var that = this;

    this.command/* :uint */;
    var flags = this.flags/* :uint */ = 0;
    this.nextOffset/* :int */;
    var penSize = this.penSize/* :int */;
    var numPoints = this.numPoints/* :int */;
    var penColor = this.penColor/* :uint */;
    var penAlpha = this.penAlpha/* :Number */;
    var lineColor = this.lineColor/* :uint */;
    var lineAlpha = this.lineAlpha/* :Number */;
    var fillColor = this.fillColor/* :uint */;
    var fillAlpha = this.fillAlpha/* :Number */;

    this.polygon = []/* :Vector.<Point>  = new Vector. < Point > ();*/;

//		[Bindable(event="fillChanged")]
    this.set_useFill = function (newValue/* :Boolean */)/* :void */ {
        var startFlags/* :uint */ = flags;
        if (newValue) {
            flags |= USE_FILL;
        }
        else {
            flags &= ~USE_FILL;
        }
        if (startFlags != flags) {
            dispatchEvent(new Event('fillChanged'));
        }
    };
    this.get_useFill = function ()/* :Boolean */ {
        return Boolean(flags & USE_FILL);
    };

//		[Bindable(event="ellipseChanged")]
    var set_isEllipse = this.set_isEllipse = function (newValue/* :Boolean */)/* :void */ {
        var startFlags/* :uint */ = flags;
        if (newValue) {
            flags |= IS_ELLIPSE;
        }
        else {
            flags &= ~IS_ELLIPSE;
        }
        if (startFlags != flags) {
            dispatchEvent(new Event('ellipseChanged'));
        }
    };
    var get_isEllipse = this.get_isEllipse = function ()/* :Boolean */ {
        return Boolean(flags & IS_ELLIPSE);
    };

//		[Bindable(event="layerChanged")]
    var set_layer = this.set_layer = function (newValue/* :uint */)/* :void */ {
        var startFlags/* :uint */ = flags;
        if (newValue == LAYER_FRONT) {
            flags |= LAYER_FRONT;
        }
        else if (newValue == LAYER_BACK) {
            flags &= ~LAYER_FRONT;
        }
        if (startFlags != flags) {
            dispatchEvent(new Event('layerChanged'));
        }
    }
    var get_layer = this.get_layer = function ()/* :uint */ {
        return flags & LAYER_FRONT;
    }

    var generatePacket = this.generatePacket = function (endian/* :String  = Endian.LITTLE_ENDIAN*/)/* :ByteArray */ {
        endian = endian || 'littleEndian';
        var ba/* :ByteArray */ = new ByteArray(1);
        ba.endian = endian;

        ba.writeShort(0); // unused -- nextOffset
        ba.writeShort(0); // unused

        var data/* :ByteArray */ = new ByteArray(1);
        data.endian = endian;

        if (that.command != CMD_DETONATE && that.command != CMD_DELETE) {
            data.writeShort(penSize);
            data.writeShort(that.polygon.length - 1);
            data.writeByte(((lineColor & 0x00FF0000) >> 16) & 0xFF); // red
            data.writeByte(((lineColor & 0x00FF0000) >> 16) & 0xFF); // red
            data.writeByte(((lineColor & 0x0000FF00) >> 8) & 0xFF);  // green
            data.writeByte(((lineColor & 0x0000FF00) >> 8) & 0xFF);  // green
            data.writeByte(lineColor & 0x000000FF);                // blue
            data.writeByte(lineColor & 0x000000FF);                // blue
            for (var point in that.polygon)
            {
                data.writeShort(point.y);
                data.writeShort(point.x);
            }

            // lineColor with alpha
            data.writeByte(Math.ceil(lineAlpha * 0xFF))
            data.writeByte(((lineColor & 0x00FF0000) >> 16) & 0xFF); // red
            data.writeByte(((lineColor & 0x0000FF00) >> 8) & 0xFF);  // green
            data.writeByte(lineColor & 0x000000FF);                // blue

            // fillColor with alpha
            data.writeByte(Math.ceil(fillAlpha * 0xFF))
            data.writeByte(((fillColor & 0x00FF0000) >> 16) & 0xFF); // red
            data.writeByte(((fillColor & 0x0000FF00) >> 8) & 0xFF);  // green
            data.writeByte(fillColor & 0x000000FF);                // blue
        }

        data.position = 0

        // Command and flags are combined into one field.
        ba.writeShort(this.command | (flags << 8));
        ba.writeShort(data.length); // commandLength
        ba.writeShort(0); // start position
        ba.writeBytes(data);
        return ba;
    }

    var readData = this.readData = function (endian/* :String */, roomBytes/* :Array */, offset/* :int */)/* :void */ {
        console.log('start of readData');
        var j/* :int */;
        var commandLength/* :uint */;
        var commandStart/* :uint */;
        var commandEndPosition/* :uint */;
        var red/* :uint */;
        var green/* :uint */;
        var blue/* :uint */;
        var alphaInt/* :uint */;
        var alpha/* :Number */;

        var ba/* :ByteArray */ = new ByteArray(10);

        for (j = offset; j < offset + 10; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;


        that.nextOffset = ba.readShort();
        ba.readShort(); // reserved, unused
        that.command = ba.readUnsignedShort();
        commandLength = ba.readUnsignedShort();
        commandStart = ba.readShort();

        flags = that.command >> 8;
        that.command = that.command & 0xFF;

        // If this is a standalone draw record inside an independent
        // draw command, commandStart will always be 0, but the header
        // is 10 bytes, so the first command starts at the 11th.
        if (commandStart == 0) {
            commandStart = 10;
        }

        commandEndPosition = commandStart + commandLength;

        if (that.command == CMD_DETONATE || that.command == CMD_DELETE) {
            return;
        }

        ba = new ByteArray(commandEndPosition-commandStart);
        for (j = commandStart; j < commandEndPosition; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;

        penSize = ba.readShort();
        numPoints = ba.readShort();

        // they doubled the values, i don't know why.
        red = ba.readUnsignedByte();
        ba.readUnsignedByte();
        green = ba.readUnsignedByte();
        ba.readUnsignedByte();
        blue = ba.readUnsignedByte();
        ba.readUnsignedByte();
        alphaInt = 0xFF;
        alpha = Number(alphaInt) / 0xFF;

        penColor = DrawColorUtil.ARGBtoUint(alphaInt, red, green, blue);
        penAlpha = alpha;
        fillColor = penColor;
        fillAlpha = penAlpha;
        lineColor = penColor;
        lineAlpha = penAlpha;


        for (j = 0; j <= numPoints; j++) {
            var y/* :int */ = ba.readShort();
            var x/* :int */ = ba.readShort();
            that.polygon.push(new Point(x, y));
        }

        if (ba.bytesAvailable) {
            try {
                alphaInt = ba.readUnsignedByte();
                red = ba.readUnsignedByte();
                green = ba.readUnsignedByte();
                blue = ba.readUnsignedByte();
                alpha = Number(alphaInt) / 0xFF;
                lineColor = DrawColorUtil.ARGBtoUint(alphaInt, red, green, blue);
                lineAlpha = alpha;

                alphaInt = ba.readUnsignedByte();
                red = ba.readUnsignedByte();
                green = ba.readUnsignedByte();
                blue = ba.readUnsignedByte();
                alpha = Number(alphaInt) / 0xFF;
                fillColor = DrawColorUtil.ARGBtoUint(alphaInt, red, green, blue);
                fillAlpha = alpha;
            }
            catch (e/* :Error */) {
                // If there was an error reading these colors, we will
                // just fall back to the old behavior of using the
                // penColor for everything, and a penSize of 0.
                fillColor = lineColor = penColor;
                fillAlpha = lineAlpha = penAlpha;
                penSize = 0;
            }
        }
        else {
            fillColor = lineColor = penColor;
            fillAlpha = lineAlpha = penAlpha;
            if (that.get_isEllipse() || that.get_useFill()) {
                // No more bytes available, must be PalaceChat 3 style
                // packets.
                penSize = 0;
            }
        }
    }

    function dispatchEvent(event) {
        that.dispatchEvent(event.type, event);
    }
}
var util = require("util");
var http = require('follow-redirects').http;

var Bitmap = require("./../../adapter/display/Bitmap");
var BitmapData = require("./../../adapter/display/BitmapData");
var Loader = require("./../../adapter/display/Loader");
var Event = require("./../../adapter/events/Event");
var EventDispatcher = require('./../../adapter/events/EventDispatcher');
var Rectangle = require("./../../adapter/geom/Rectangle");
var URLRequest = require("./../../adapter/net/URLRequest");
var LoaderContext = require("./../../adapter/system/LoaderContext");
var ByteArray = Buffer;
var Endian = require("./../../adapter/utils/Endian");
var setTimeout = require("./../../adapter/system/setTimeout");

var FlexBitmap = require("./../../adapter/core/FlexBitmap");
var PNGEncoder = require("./../../adapter/graphics/codec/PNGEncoder");
var PalaceAsset = require("./PalaceAsset");
var PalacePropFormat = require("./PalacePropFormat");
var PalacePalette = require("./PalacePalette");

var PropEvent = require("../event/PropEvent");
var PNGEncoder = require("../../../PalaceClient/adapter/graphics/codec/PNGEncoder.js");


//	[Event(name="propLoaded",type="net.codecomposer.palace.event.PropEvent")]
//	[Event(name="propDecoded",type="net.codecomposer.palace.event.PropEvent")]
module.exports = PalaceProp;

var HEAD_FLAG = module.exports.HEAD_FLAG/* :uint */ = 0x02;
var GHOST_FLAG = module.exports.GHOST_FLAG/* :uint */ = 0x04;
var RARE_FLAG = module.exports.RARE_FLAG/* :uint */ = 0x08;
var ANIMATE_FLAG = module.exports.ANIMATE_FLAG/* :uint */ = 0x10;
var PALINDROME_FLAG = module.exports.PALINDROME_FLAG/* :uint */ = 0x20; //Bounce?
var BOUNCE_FLAG = module.exports.BOUNCE_FLAG/* :uint */ = 0x20;

var PROP_FORMAT_S20BIT = module.exports.PROP_FORMAT_S20BIT/* :uint */ = 0x200;
var PROP_FORMAT_20BIT = module.exports.PROP_FORMAT_20BIT/* :uint */ = 0x40;
var PROP_FORMAT_32BIT = module.exports.PROP_FORMAT_32BIT/* :uint */ = 0x100;
var PROP_FORMAT_8BIT = module.exports.PROP_FORMAT_8BIT/* :uint */ = 0x00;

var dither20bit/* :Number */ = 255 / 63;
var ditherS20Bit/* :Number */ = 255 / 31;

var ASSET_CRC_MAGIC/* :uint */ = 0xd9216290;

var rect/*:Rectangle*/ = new Rectangle(0, 0, 44, 44);

var mask/* :uint */ = 0xFFC1; // Original palace prop flags.

util.inherits(PalaceProp, EventDispatcher);//extends EventDispatcher
function PalaceProp(guid/* :String */, assetId/* :uint */, assetCrc/* :uint */) {
    PalaceProp.super_.call(this);
    var that = this;

    this.asset = new PalaceAsset();
    this.asset.id = assetId;
    this.asset.crc = assetCrc;
    this.asset.guid = guid;


    this.width/* :int */ = 0;
    this.height/* :int */ = 0;
    this.horizontalOffset/* :int */ = 0;
    this.verticalOffset/* :int */ = 0;
    this.scriptOffset/* :int */ = 0;
    this.flags/* :uint */ = 0;
    var _bitmap/* :BitmapData */ = null;
    this.ready/* :Boolean */ = false;
    this.badProp/* :Boolean */ = false;

    this.head/* :Boolean */ = false;
    this.ghost/* :Boolean */ = false;
    this.rare/* :Boolean */ = false;
    this.animate/* :Boolean */ = false;
    this.palindrome/* :Boolean */ = false;
    this.bounce/* :Boolean */ = false;
    this.propFormat/* :uint */ = 0x00;

    this.webServiceFormat/* :String */ = "";

    this.palaceHost = "";
    this.palacePort = "";


    var formatMask/* :uint */ = PROP_FORMAT_20BIT |
        PROP_FORMAT_S20BIT |
        PROP_FORMAT_32BIT;

    var itemsToRender/* :int */ = 0;

    var loader/* :Loader */ = null;


    this.__defineGetter__("bitmap", function () {
        return _bitmap;
    });

    this.__defineSetter__("bitmap", function (val) {
        _bitmap = val;
    });


//    Object.defineProperty(this, "bitmap", {
//        get: function ()/* :ByteArray */ {
//            if (_bitmap) {
//                return _bitmap;
//            }
//            else {
//                return null;
//            }
//        },
//        set: function (newBitmap/* :Object */) {
//            _bitmap = newBitmap;
//        }
//    });

    Object.defineProperty(this, "pngData", {
        get: function ()/* :ByteArray */ {
            if (_bitmap != null) {
                var encoder /*:PNGEncoder*/ = new PNGEncoder();
                return encoder.encode(_bitmap, 44, 44);
            }
            else {
                return null;
            }
        },
        set: function (value) {
            that._bitmap = value;
        }
    });

    this.decodeProp = function ()/* :void */ {
        // Try not to block the UI while props are rendering.
        setTimeout(renderBitmap, 20 + 10 * (++itemsToRender));
    };

    this.loadBitmapFromURL = function (url/* :String  = null*/) /*:void */ {
        if (url == null) {
            url = that.asset.imageDataURL;
        }
//        loader = new Loader();
//        var request/* :URLRequest */ = new URLRequest(url);
//
//        var context/* :Loader Context */ = new LoaderContext(true);
//
//        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, handleBitmapLoadedFromURLComplete);
//        loader.load(request, context);
        that.url = url;
        dispatchEvent(new PropEvent(PropEvent.PROP_LOADED, that));
    };

//    function handleBitmapLoadedFromURLComplete(event/* :Event */)/* :void */ {
//        if (loader.content && loader.content /*is Bitmap*/) {
//            that.bitmap = Bitmap(loader.content).bitmapData;
//            that.ready = true;
//            dispatchEvent(new PropEvent(PropEvent.PROP_LOADED, that));
//        }
//    }

    function renderBitmap()/* :void */ {
        console.log('renderbitmap');
        --itemsToRender;
        var asset = that.asset;
        var flags;

        // little/big endian
        if (asset.data[1] == 0) {
            that.width = asset.data[0] | asset.data[1] << 8;
            that.height = asset.data[2] | asset.data[3] << 8;
            that.horizontalOffset = toSignedShort(asset.data[4] | asset.data[5] << 8);
            that.verticalOffset = toSignedShort(asset.data[6] | asset.data[7] << 8);
            that.scriptOffset = asset.data[8] | asset.data[9] << 8;
            that.flags = asset.data[10] | asset.data[11] << 8;
        }
        else {
            that.width = asset.data[1] | asset.data[0] << 8;
            that.height = asset.data[3] | asset.data[2] << 8;
            that.horizontalOffset = toSignedShort(asset.data[5] | asset.data[4] << 8);
            that.verticalOffset = toSignedShort(asset.data[7] | asset.data[6] << 8);
            that.scriptOffset = asset.data[9] | asset.data[8] << 8;
            that.flags = asset.data[11] | asset.data[10] << 8;
        }

        flags = that.flags;
        that.propFormat = flags & formatMask;

        trace("Non-Standard flags: " + /* uint */(flags & mask).toString(16));

        that.head = Boolean(flags & HEAD_FLAG);
        that.ghost = Boolean(flags & GHOST_FLAG);
        that.rare = Boolean(flags & RARE_FLAG);
        that.animate = Boolean(flags & ANIMATE_FLAG);
        that.palindrome = Boolean(flags & PALINDROME_FLAG);
        that.bounce = Boolean(flags & BOUNCE_FLAG);

        if ((flags & mask) == 0xff80) {
            //WTF?!  Bizarre flags...
            trace("16bit prop");
            that.webServiceFormat = PalacePropFormat.FORMAT_16_BIT;
            decode16BitProp();
        }
        else if (Boolean(that.propFormat & PROP_FORMAT_S20BIT)) {
            trace("s20bit prop");
            that.webServiceFormat = PalacePropFormat.FORMAT_S20_BIT;
            decodeS20BitProp();
        }
        else if (Boolean(that.propFormat & PROP_FORMAT_32BIT)) {
            trace("32bit prop");
            that.webServiceFormat = PalacePropFormat.FORMAT_32_BIT;
            decode32BitProp();
        }
        else if (Boolean(that.propFormat & PROP_FORMAT_20BIT)) {
            trace("20bit prop");
            that.webServiceFormat = PalacePropFormat.FORMAT_20_BIT;
            decode20BitProp();
        }
        else {
            trace("8bit prop");
            that.webServiceFormat = PalacePropFormat.FORMAT_8_BIT;
            decode8BitProp();
        }

        if (!that.badProp) {
            that.ready = true;
            dispatchEvent(new PropEvent(PropEvent.PROP_DECODED, that));
        }

        // We need to keep the asset data around now, to be able
        // to upload it to other servers.
        //asset.data = null;
//        var fs = require('fs');
//        var pngEncoder = new PNGEncoder();
//        var png = pngEncoder.encode(that.bitmap, 44, 44, 'rgba');
//        var filename = './'+ that.asset.crc +'.png'
//        fs.writeFileSync(filename, png.toString('binary'), 'binary');

        dispatchEvent(new PropEvent(PropEvent.PROP_LOADED, that));
    }

    function toSignedShort(int) {
        if (int & 0x8000) {
            return int - 0x10000;
        }
        return int & 0xffff;
    }

    function computeCRC(data/* :ByteArray */)/* :uint */ {
        var originalPosition/* :uint */ = data.position;
        data.position = 0;
        var crc/* :uint */ = ASSET_CRC_MAGIC;
        var len/* :int */ = data.bytesAvailable;
        while (len--) {
            var currentByte/* :uint */ = data.readUnsignedByte();
            crc = ((crc << 1) | ((crc & 0x80000000) ? 1 : 0)) ^ (currentByte);
        }
        data.position = originalPosition;
        return crc;
    }

    this.assetData = function (endian/* :String = Endian.LITTLE_ENDIAN */)/* :ByteArray */ {
//			trace("Generating asset for server...");
        var ba/* :ByteArray */ = new ByteArray();
        ba.endian = endian;

        var flags/* :uint */ = 0;
        if (that.animate)
            flags = flags | ANIMATE_FLAG;
        if (that.bounce)
            flags = flags | BOUNCE_FLAG;
        if (that.head)
            flags = flags | HEAD_FLAG;
        if (that.palindrome)
            flags = flags | PALINDROME_FLAG;
        if (that.rare)
            flags = flags | RARE_FLAG;
        if (that.ghost)
            flags = flags | GHOST_FLAG;

        // Set s20bit format
        flags = flags | PROP_FORMAT_S20BIT;

        var imageData/* :ByteArray */ = encodeS20BitProp();
        imageData.position = 0;
        var assetCRC/* :uint */ = computeCRC(imageData);

        var size/* :uint */ = imageData.length + 12; // 12 bytes for metadata

        // AssetType
        ba.writeInt(PalaceAsset.ASSET_TYPE_PROP);

        // AssetSpec
        ba.writeInt(that.asset.id);
        ba.writeUnsignedInt(assetCRC);

        // BlockSize
        ba.writeInt(size);

        // BlockOffset
        ba.writeInt(0); // always zero

        // BlockNbr
        ba.writeShort(0); // always zero

        // NbrBlocks
        ba.writeShort(1);

        // AssetDescriptor
        // flags
        ba.writeUnsignedInt(0); // this is unused.. not really the prop flags
        // size
        ba.writeUnsignedInt(size);
        // name
        ba.writeByte(that.asset.name.length);
        var paddedName/* :String */ = that.asset.name;
        for (var ct/* :int */ = 0; ct < 31 - that.asset.name.length; ct++) {
            paddedName += " ";
        }
//			trace("PaddedName: \"" + paddedName + "\" length: " + paddedName.length);
        ba.writeMultiByte(paddedName, 'Windows-1252');

        // Data -- first 12 bytes are info about prop
        ba.writeShort(44);
        ba.writeShort(44);
        if (that.width > 44 || that.height > 44) {
            ba.writeShort(0);
            ba.writeShort(0);
        }
        else {
            ba.writeShort(that.horizontalOffset);
            ba.writeShort(that.verticalOffset);
        }
        ba.writeShort(0); // script offset??!
        ba.writeShort(flags);

        // Image Data
        ba.writeBytes(imageData);

        return ba;
    };

    function decode32BitProp()/* :void */ {
        // Implementation thanks to Phalanx team
        // Translated from VB6 implementation
        var data/* :ByteArray */ = new ByteArray(that.asset.data.length);
        for (var i/* :int */ = 12; i < that.asset.data.length; i++) {
            data.writeByte(that.asset.data[i]);
        }
        data.position = 0;
        //trace("Computed CRC: " + computeCRC(data) + " - Given CRC: " + asset.crc);

        data.uncompress(function(err, data){
            if (err) {
                console.log('uncompress-error:');
                console.log(data.toString('base64'));
            }

            var bitmapData/* :BitmapData */ = new BitmapData(that.width, that.height);
            var ofst/* :int */ = 0;
            var X/* :int */ = 0;
            var A/* :uint */ = 0;
            var R/* :uint */ = 0;
            var G/* :uint */ = 0;
            var B/* :uint */ = 0;

            var rgba = [];
            for (X = 0; X <= 1935; X++) {
                ofst = X * 4;
                R = data[ofst];
                G = data[ofst + 1];
                B = data[ofst + 2];
                A = data[ofst + 3];

                rgba.push(R);
                rgba.push(G);
                rgba.push(B);
                rgba.push(~A);
            }
            bitmapData.setVector(rect, rgba);
            that.bitmap = bitmapData.get();
        });
    }

    function decode20BitProp()/* :void */ {
        // Implementation thanks to Phalanx team
        // Translated from VB6 implementation

        var data/* :ByteArray */ = new ByteArray(that.asset.data.length);
        for (var i/* :int */ = 12; i < that.asset.data.length; i++) {
            data.writeByte(that.asset.data[i]);
        }
        data.position = 0;
//        trace("Computed CRC: " + computeCRC(data) + " - Given CRC: " + that.asset.crc);
        data.uncompress(function(err, data){
            if (err) {
                console.log('uncompress-error:');
                console.log(data.toString('base64'));
            }

            var bitmapData/* :BitmapData */ = new BitmapData(that.width, that.height, true);
            var C/* :uint */ = 0;
            var ofst/* :int */ = 0;
            var X/* :int */ = 0;
            var A/* :uint */ = 0;
            var R/* :uint */ = 0;
            var G/* :uint */ = 0;
            var B/* :uint */ = 0;

            var rgba = [];
            for (X = 0; X <= 967; X++) {
                ofst = X * 5;
                R = /* uint */((/*uint*/(data[ofst] >> 2) & 63) * dither20bit);
                C = (data[ofst] << 8) | data[ofst + 1];
                G = /* uint */(((C >> 4) & 63) * dither20bit);
                C = (data[ofst + 1] << 8) | data[ofst + 2];
                B = /* uint */(((C >> 6) & 63) * dither20bit);
                A = (((C >> 4) & 3) * 85);

                rgba.push(R);
                rgba.push(G);
                rgba.push(B);
                rgba.push(~A);

                C = (data[ofst + 2] << 8) | data[ofst + 3];
                R = /* uint */(((C >> 6) & 63) * dither20bit);
                G = /* uint */((C & 63) * dither20bit);
                C = data[ofst + 4];
                B = /* uint */(((C >> 2) & 63) * dither20bit);
                A = ((C & 3) * 85);

                rgba.push(R);
                rgba.push(G);
                rgba.push(B);
                rgba.push(~A);
            }
            bitmapData.setVector(rect, rgba);
            that.bitmap = bitmapData.get();
        });
    }


    function encodeS20BitProp()/* :ByteArray */ {
        // Implementation ported from REALBasic code provided by
        // Jameson Heesen (Pa\/\/n), of PalaceChat
        var ba/* :ByteArray */ = new ByteArray();
        ba.endian = Endian.BIG_ENDIAN;
        var bm/* :FlexBitmap */ = FlexBitmap(that.bitmap);
        if (bm && bm instanceof FlexBitmap) {
            var bitmapData/* :BitmapData */ = bm.bitmapData;
            var propBit16/* :Number */ = 31 / 255;
            var data/* :Vector.<uint> */ = bitmapData.getVector(new Rectangle(0, 0, 44, 44));
            var pixelIndex/* :uint */ = 0;
            var intComp/* :uint */ = 0;
            var a/* :uint */, r/* :uint */, g/* :uint */, b/* :uint */;
            for (var y/* :int */ = 0; y < 44; y++) {
                for (var x/* :int */ = 0; x < 44; x++) {
                    var color/* :uint */;
                    color = data[pixelIndex];
                    a = ((color & 0xFF000000) >> 24) & 0xFF;
                    r = ((color & 0x00FF0000) >> 16) & 0xFF;
                    g = ((color & 0x0000FF00) >> 8) & 0xFF;
                    b = (color & 0x000000FF);
                    intComp = /* uint */(Math.round(Number(r) * propBit16)) << 19;
                    intComp = intComp | (/*uint*/(Math.round(Number(g) * propBit16)) << 14);
                    intComp = intComp | (/*uint*/(Math.round(Number(b) * propBit16)) << 9);
                    intComp = intComp | (/*uint*/(Math.round(Number(a) * propBit16)) << 4);

                    ba.writeByte((intComp & 0xFF0000) >> 16);
                    ba.writeByte((intComp & 0xFF00) >> 8);
                    // ba.writeByte(intComp & 0xF0);

                    pixelIndex++;
                    x++;

                    intComp = (intComp & 0xF0) << 16;

                    color = data[pixelIndex];
                    a = ((color & 0xFF000000) >> 24) & 0xFF;
                    r = ((color & 0x00FF0000) >> 16) & 0xFF;
                    g = ((color & 0x0000FF00) >> 8) & 0xFF;
                    b = (color & 0x000000FF);

                    intComp = intComp | (/* uint */(Math.round(Number(r) * propBit16)) << 15);
                    intComp = intComp | (/* uint */(Math.round(Number(g) * propBit16)) << 10);
                    intComp = intComp | (/* uint */(Math.round(Number(b) * propBit16)) << 5);
                    intComp = intComp | /* uint */(Math.round(Number(a) * propBit16));

                    ba.writeByte((intComp & 0xFF0000) >> 16);
                    ba.writeByte((intComp & 0x00FF00) >> 8);
                    ba.writeByte(intComp & 0x0000FF);

                    pixelIndex++;
                }
            }
        }
        ba.compress();
        ba.position = 0;
        return ba;
    }

    function decodeS20BitProp()/* :void */ {
        // Implementation thanks to Phalanx team
        // Translated from C++ implementation

        var data/* :ByteArray */ = new ByteArray(that.asset.data.length);
        for (var i/* :int */ = 12; i < that.asset.data.length; i++) {
            data.writeByte(that.asset.data[i]);
        }
        data.position = 0;
        //trace("Computed CRC: " + computeCRC(data) + " - Given CRC: " + asset.crc);
        data.uncompress(function(err, data){
            if (err) {
                console.log('uncompress-error:');
                console.log(data.toString('base64'));
            }

            var bitmapData/* :BitmapData */ = new BitmapData(that.width, that.height);
            var C/* :uint */;
            var x/* :int */ = 0;
            var y/* :int */ = 0;
            var ofst/* :int */ = 0;
            var X/* :int */ = 0;

            var color/* :uint */;

            var A/* :uint */, R/* :uint */, G/* :uint */, B/* :uint */;

            var pos/* :uint */ = 0;

            var rgba = [];
            for (X = 0; X < 968; X++) {
                ofst = X * 5;

                R = /* uint */(((data[ofst] >> 3) & 31) * ditherS20Bit) & 0xFF; // << 3; //red
                C = (data[ofst] << 8) | data[ofst + 1];
                G = /* uint */((C >> 6 & 31) * ditherS20Bit) & 0xFF; //<< 3; //green
                B = /* uint */((C >> 1 & 31) * ditherS20Bit) & 0xFF; //<< 3; //blue
                C = (data[ofst + 1] << 8) | data[ofst + 2];
                A = /* uint */((C >> 4 & 31) * ditherS20Bit) & 0xFF; //<< 3; //alpha

                rgba.push(R);
                rgba.push(G);
                rgba.push(B);
                rgba.push(~A);

                x++;

                C = (data[ofst + 2] << 8) | data[ofst + 3];
                R = /* uint */((C >> 7 & 31) * ditherS20Bit) & 0xFF; // << 3; //red
                G = /* uint */((C >> 2 & 31) * ditherS20Bit) & 0xFF; // << 3; //green
                C = (data[ofst + 3] << 8) | data[ofst + 4];
                B = /* uint */((C >> 5 & 31) * ditherS20Bit) & 0xFF; // << 3; //blue
                A = /* uint */((C & 31) * ditherS20Bit) & 0xFF; // << 3; //alpha

                rgba.push(R);
                rgba.push(G);
                rgba.push(B);
                rgba.push(~A);

                if (x > 43) {
                    x = 0;
                    y++;
                }
            }
            bitmapData.setVector(rect, rgba);
            that.bitmap = bitmapData.get();
        });
    }

    function decode16BitProp()/* :void */ {
        // Implementation thanks to Phalanx team
        // Translated from C++ implementation

        var ba/* :Vector.<uint> */ = []; // new Vector. < uint > (width * height, true);
        var bd/* :BitmapData */ = new BitmapData(that.width, that.height, true);
        var A/* :uint */ = 0;
        var R/* :uint */ = 0;
        var G/* :uint */ = 0;
        var B/* :uint */ = 0;
        var C/* :uint */;
        var x/* :int */ = 0;
        var y/* :int */ = 0;
        var ofst/* :int */ = 0;
        var X/* :int */ = 0;

        // gunzip the props...
        var data/* :ByteArray */ = new ByteArray();
        for (var i/* :int */ = 12; i < that.asset.data.length; i++) {
            data.writeByte(that.asset.data[i]);
        }
        data.position = 0;
        //trace("Computed CRC: " + computeCRC(data) + " - Given CRC: " + asset.crc);
        data.uncompress();

        var pos/* :uint */ = 0;

        for (X = 0; X < 1936; X++) {
            ofst = X * 2;
            C = data[ofst] * 256 | data[ofst + 1];
            R = /* uint */((/* uint */(data[ofst] / 8) & 31) * 255 / 31) & 0xFF;
            G = /* uint */((/* uint */(C / 64) & 31) * 255 / 31) & 0xFF;
            B = /* uint */((/* uint */(C / 2) & 31) * 255 / 31) & 0xFF;
            A = (C & 1) * 255 & 0xFF;

            ba[pos++] = (A << 24 | R << 16 | G << 8 | B);

            x++;

            if (x > 43) {
                x = 0;
                y++;
            }

        }

        bd.setVector(rect, ba);
        that.bitmap = bd.get();
    }

    function decode8BitProp()/* :void */ {
//        console.log('decoding 8 bit prop');
        var counter/* :int */ = 0;
        //var ba/* :ByteArray */ = new ByteArray(that.asset.data.length - 12);
        var pixData/* :Vector.<uint> */ = []; // new Vector. < uint > (width * (height + 1), true);
        var n/* :int */ = 12;
//			for (n = 12; n < that.asset.data.length; n++) {

//				ba.writeByte(that.asset.data[n]);
//			}
//			ba.position = 0;
//			trace("Computed CRC: " + computeCRC(ba) + " - Given CRC: " + asset.crc);
//			
//			n = 12;
        var index/* :int */ = that.width;
        for (var y/* :int */ = that.height - 1; y >= 0; y--) {
            for (var x/* :int */ = that.width; x > 0;) {
                var cb/* :int */ = that.asset.data[n] & 0xff;
                n++;
                var mc/* :int */ = cb >> 4;
                var pc/* :int */ = cb & 0xF;
                x -= mc + pc;
                if (x < 0) {
                    that.badProp = true;
                    that.ready = false;
                    that.asset.data = null;
                    return;
                }
                if (counter++ > 6000) {
                    // script runaway protection
                    trace("There was an error while decoding props.  Max loop count exceeded.");
                    that.badProp = true;
                    that.ready = false;
                    that.asset.data = null;
                    return;
                }

                index += mc;
                while (pc-- > 0) {
                    if (that.asset.data.length > n) {
                        pixData[index++] = PalacePalette.clutARGB[that.asset.data[n++] & 0xff];
                    }
                }
            }

        }


        // Using setPixels() now instead of setPixel() -- WAY faster.

        var bitmapBytes/* :Vector.<uint> */ = []; //new Vector. < uint > (width * height, true);
        var pos/* :uint */ = 0;
        var z/* :int */ = pixData.length;
        for (y = 44; y < z; y++) {
            bitmapBytes[pos++] = pixData[y];
        }

        var rgba = [];
        var i;
        for (i = 0; i < bitmapBytes.length; i++) {
            rgba.push(bitmapBytes[i] >> 16 & 0xff);
            rgba.push(bitmapBytes[i] >> 8 & 0xff);
            rgba.push(bitmapBytes[i] & 0xff);
            if (bitmapBytes[i] == undefined) {
                rgba.push(0xff);
            } else {
                rgba.push(0x00);
            }
        }
        for (i = bitmapBytes.length; i < 44 * 44; i++) {
            rgba.push(0xff);
            rgba.push(0xff);
            rgba.push(0xff);
            rgba.push(0xff);
        }

        var bitmapData/* :BitmapData */ = new BitmapData(that.width, that.height, true);
        bitmapData.setVector(rect, rgba);

        that.bitmap = bitmapData.get();
    }

    function trace(data) {
        console.log(data);
    }

    function dispatchEvent(event) {
        that.dispatchEvent(event.type, event);
    }
}

module.exports.fromObject = fromObject;
function fromObject(source/* :Object */)/* :PalaceProp */ {
    var prop/* :PalaceProp */ = new PalaceProp(source.asset.guid, source.asset.id, source.asset.crc);
    prop.animate = source.animate;
    prop.width = source.width;
    prop.height = source.height;
    prop.horizontalOffset = source.horizontalOffset;
    prop.verticalOffset = source.verticalOffset;
    prop.scriptOffset = source.scriptOffset;
    prop.flags = source.flags;
    prop.ready = false;
    prop.badProp = source.badProp;
    prop.head = source.head;
    prop.ghost = source.ghost;
    prop.rare = source.rare;
    prop.animate = source.animate;
    prop.palindrome = source.palindrome;
    prop.bounce = source.bounce;
    prop.propFormat = source.propFormat;
    prop.webServiceFormat = source.webServiceFormat;
    prop.asset.blockCount = source.asset.blockCount;
    prop.asset.blockNumber = source.asset.blockNumber;
    prop.asset.blockOffset = source.asset.blockOffset;
    prop.asset.blockSize = source.asset.blockSize;
    prop.asset.crc = source.asset.crc;
    prop.asset.data = source.asset.data;
    prop.asset.flags = source.asset.flags;
    prop.asset.id = source.asset.id;
    prop.asset.name = source.asset.name;
    prop.asset.type = source.asset.type;
    return prop;
}

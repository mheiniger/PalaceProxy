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

var util = require('util');

//	import flash.display.Bitmap;
//	import flash.display.BitmapData;
//	import flash.display.Loader;
//	import flash.events.Event;

var EventDispatcher = require("../../adapter/events/EventDispatcher");

//	import flash.events.EventDispatcher;
//	import flash.events.HTTPStatusEvent;
//	import flash.events.IOErrorEvent;
//	import flash.events.SecurityErrorEvent;
var Point = require("./Point");
//	import flash.geom.Point;
//	import flash.net.URLRequest;

//	import mx.core.FlexBitmap;

var PalaceSecurityErrorEvent = require("./../event/PalaceSecurityErrorEvent");
//	import net.codecomposer.palace.rpc.PalaceClient;

//	import org.openpalace.iptscrae.IptUtil;

//	[Event(type="flash.events.Event",name="imageLoaded")]
//	[Event(type="net.codecomposer.palace.event.PalaceSecurityErrorEvent",name="securityError")]

/* \[Bindable\] */
util.inherits(PalaceImageOverlay, EventDispatcher); //extends EventDispatcher

function PalaceImageOverlay() {
    PalaceImageOverlay.super_.call(this);

    var that = this;

    this.refCon/* :int */ = 0;
    this.id/* :int */ = 0;
    this.transparencyIndex/* :int */ = 0;
    this.name/* :String */ = "";
    this.filename/* :String */ = "";
    this.mediaServer/* :String */ = "";

    var filenameWithoutExtension/* :String */;
    var extensionsToTry/* :Array */;
    var _bitmapData/* :BitmapData */;
    var loader/* :Loader */;

    this.get_bitmapData = function ()/* :BitmapData */ {
        return _bitmapData;
    };

    this.get_bitmap = function ()/* :FlexBitmap */ {
        if (_bitmapData) {
            return new FlexBitmap(_bitmapData, "auto", true);
        }
        return null;
    };

    this.loadImage = function ()/* :void */ {
        var match/* :Array */ = that.filename.match(/^(.*)\.(.*)$/);
        if (match && match[1]) {
            filenameWithoutExtension = match[1];
            extensionsToTry = ['png', 'jpg'];
            tryFormatFallback();
        }
        else {
            extensionsToTry = null;
            loadFileName(that.filename);
        }
    };

    function tryFormatFallback()/* :void */ {
        // null extensionsToTry means we've exhausted all possibilities
        if (extensionsToTry) {
            if (extensionsToTry.length > 0) {
                loadFileName(filenameWithoutExtension + "." + extensionsToTry.shift());
            }
            else {
                extensionsToTry = null;
                loadFileName(that.filename);
            }
        }
    }

    function loadFileName(filename/* :String */)/* :void */ {
        //todo: implement images (on client side)
//        loader = new Loader();
//        var urlRequest/* :URLRequest */ = new URLRequest(mediaServer + filename);
//        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, handleImageLoadComplete);
//        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, handleLoadError);
//        loader.contentLoaderInfo.addEventListener(HTTPStatusEvent.HTTP_STATUS, handleLoadHttpStatus);
//        loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
//        loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
//        loader.load(urlRequest, PalaceClient.loaderContext);
    }

    function handleSecurityError(error/* :SecurityErrorEvent = null */)/* :void */ {
        var securityError/* :PalaceSecurityErrorEvent */ = new PalaceSecurityErrorEvent(PalaceSecurityErrorEvent.SECURITY_ERROR);
        dispatchEvent(securityError);
    }

    function processTransparency(bitmapData/* :BitmapData */)/* :void */ {
        var transparencyColor/* :uint */ = 0;
        var preExistingTransparency/* :Boolean */ = false;
        trace(that.filename + ": Already Transparent: " + (bitmapData.transparent ? "true" : "false") + " - transparencyIndex: " + that.transparencyIndex);

        if (!bitmapData.transparent) {
            var newBd/* :BitmapData */ = new BitmapData(bitmapData.width, bitmapData.height, true, 0x00000000);
            newBd.copyPixels(bitmapData, bitmapData.rect, new Point(bitmapData.rect.x, bitmapData.rect.y));
            bitmapData = newBd;
            preExistingTransparency = false;
        }
        else {
            // Check to see if there are actually any transparent pixels.
            var pixels/* :Vector.<uint> */ = bitmapData.getVector(bitmapData.rect);
            for (var pixel/* :uint */ in pixels) {
                if (((pixel >> 24) & 0xFF) < 0xFF) {
                    preExistingTransparency = true;
                    break;
                }
            }
            trace("Pixel scan found transparency: " + preExistingTransparency);
        }

        if (that.transparencyIndex > -1 && !preExistingTransparency) {
            // Transparency index of -1 means "no transparency"
            if (that.transparencyIndex > 0) {
                // process transparency color from Palace
                // Palette Index Lookup
                transparencyColor = PalacePalette.imageClutARGB[transparencyIndex];
            }
            else {
                // Transparency index of 0 means "use the bottom-left
                // pixel color as the transparency color" -- bizarre...
                transparencyColor = bitmapData.getPixel32(1, bitmapData.height - 1);
            }
            trace("Transparency color: " + transparencyColor.toString(16));


            bitmapData.threshold(
                bitmapData,
                bitmapData.rect,
                new Point(bitmapData.rect.x, bitmapData.rect.y),
                "==",
                transparencyColor,
                0x00AAFF00
            );
        }

        _bitmapData = bitmapData;
        dispatchEvent(new Event('bitmapDataChange'));
        dispatchEvent(new Event('imageLoaded'));
    }

    function dispatchEvent(event){
        that.dispatchEvent(event);
    }

    function trace(text){
        console.log(text);
    }

    function handleImageLoadComplete(event/* :Event */)/* :void */ {
        if (loader.content /*is Bitmap*/) {
            try {
                var bitmapData/* :BitmapData */ = Bitmap(loader.content).bitmapData;
                processTransparency(bitmapData);
            }
            catch (e/* :Error */) {
                handleSecurityError();
                trace("Error while accessing BitmapData: " + e);
            }
        }
        else {
            trace("Content is not a Bitmap!  Actual content type: " + IptUtil.className(loader.content));
        }
    }

    function handleLoadError(error/* :IOErrorEvent */)/* :void */ {
        tryFormatFallback();
    }

    function handleLoadHttpStatus(error/* :HTTPStatusEvent */)/* :void */ {
        // trace("HTTP Status for hotspot image #" + id + " - " + that.filename + ": " + error.status);
    }
}
//}

module.exports = PalaceImageOverlay;

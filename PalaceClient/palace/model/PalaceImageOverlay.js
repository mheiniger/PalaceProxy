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
//	import flash.geom.Point;
//	import flash.net.URLRequest;

//	import mx.core.FlexBitmap;

//	import net.codecomposer.palace.event.PalaceSecurityErrorEvent;
//	import net.codecomposer.palace.rpc.PalaceClient;

//	import org.openpalace.iptscrae.IptUtil;

//	[Event(type="flash.events.Event",name="imageLoaded")]
//	[Event(type="net.codecomposer.palace.event.PalaceSecurityErrorEvent",name="securityError")]

/* \[Bindable\] */
util.inherits(PalaceImageOverlay, EventDispatcher); //extends EventDispatcher

function PalaceImageOverlay() {
    PalaceImageOverlay.super_.call(this);

    this.constants = {};

    var refCon = this.refCon/* :int */;
    var id = this.id/* :int */;
    var transparencyIndex = this.transparencyIndex/* :int */;
    var name = this.name/* :String */;
    var filename = this.filename/* :String */;
    var mediaServer = this.mediaServer/* :String */;

    var filenameWithoutExtension/* :String */;
    var extensionsToTry/* :Array */;
    var _bitmapData/* :BitmapData */;
    var loader/* :Loader */;

//		[Bindable(event="bitmapDataChange")]
    var get_bitmapData = this.get_bitmapData = function ()/* :BitmapData */ {
        return _bitmapData;
    }

//		[Bindable(event="bitmapDataChange")]
    var get_bitmap = this.get_bitmap = function ()/* :FlexBitmap */ {
        if (_bitmapData) {
            return new FlexBitmap(_bitmapData, "auto", true);
        }
        return null;
    }

    var loadImage = this.loadImage = function ()/* :void */ {
        var match/* :Array */ = filename.match(/^(.*)\.(.*)$/);
        if (match && match[1]) {
            filenameWithoutExtension = match[1];
            extensionsToTry = ['png', 'jpg'];
            tryFormatFallback();
        }
        else {
            extensionsToTry = null;
            loadFileName(filename);
        }
    }

    function tryFormatFallback()/* :void */ {
        // null extensionsToTry means we've exhausted all possibilities
        if (extensionsToTry) {
            if (extensionsToTry.length > 0) {
                loadFileName(filenameWithoutExtension + "." + extensionsToTry.shift());
            }
            else {
                extensionsToTry = null;
                loadFileName(filename);
            }
        }
    }

    function loadFileName(filename/* :String */)/* :void */ {
        loader = new Loader();
        var urlRequest/* :URLRequest */ = new URLRequest(mediaServer + filename);
        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, handleImageLoadComplete);
        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, handleLoadError);
        loader.contentLoaderInfo.addEventListener(HTTPStatusEvent.HTTP_STATUS, handleLoadHttpStatus);
        loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
        loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
        loader.load(urlRequest, PalaceClient.loaderContext);
    }

    function handleSecurityError(error/* :SecurityErrorEvent = null */)/* :void */ {
        var securityError/* :PalaceSecurityErrorEvent */ = new PalaceSecurityErrorEvent(PalaceSecurityErrorEvent.SECURITY_ERROR);
        dispatchEvent(securityError);
    }

    function processTransparency(bitmapData/* :BitmapData */)/* :void */ {
        var transparencyColor/* :uint */ = 0;
        var preExistingTransparency/* :Boolean */ = false;
        trace(filename + ": Already Transparent: " + (bitmapData.transparent ? "true" : "false") + " - transparencyIndex: " + transparencyIndex);

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

        if (transparencyIndex > -1 && !preExistingTransparency) {
            // Transparency index of -1 means "no transparency"
            if (transparencyIndex > 0) {
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
        // trace("HTTP Status for hotspot image #" + id + " - " + filename + ": " + error.status);
    }
}
//}

module.exports = PalaceImageOverlay;
var PalaceImageOverlayVar = new PalaceImageOverlay();
for (name in PalaceImageOverlayVar.constants) {
    module.exports[name] = PalaceImageOverlayVar.constants[name];
}
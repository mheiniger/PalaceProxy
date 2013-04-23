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
var ByteArray = Buffer;

//	import net.codecomposer.palace.view.HotSpotImage;

/* \[Bindable\] */
function PalaceHotspotState() {
    this.constants = {};

    var pictureId = this.pictureId/* :int */;
    var x = this.x/* :int */;
    var y = this.y/* :int */;
    var opacity = this.opacity/* :Number */ = 1;
    var hotspotImage = this.hotspotImage/* :HotSpotImage */;

    var size = this.constants.size/* :int */ = 8;

    var UNLOCKED = this.constants.UNLOCKED/* :int */ = 0;
    var LOCKED = this.constants.LOCKED/* :int */ = 1;

    var PalaceHotspotState = this.PalaceHotspotState = function () {
    }

    var readData = this.readData = function (endian/* :String */, roomBytes/* :Array */, offset/* :int */)/* :void */ {
        var ba/* :ByteArray */ = new ByteArray(size + 1);
        for (var j/* :int */ = offset; j < offset + size + 1; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;

        pictureId = ba.readShort();
        ba.readShort(); // Filler for alignment
        y = ba.readShort();
        x = ba.readShort();
    }

}
//}

module.exports = PalaceHotspotState;
var PalaceHotspotStateVar = new PalaceHotspotState();
for (name in PalaceHotspotStateVar.constants) {
    module.exports[name] = PalaceHotspotStateVar.constants[name];
}
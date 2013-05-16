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
var ByteArray = Buffer;
//	import net.codecomposer.palace.view.HotSpotImage;
module.exports = PalaceHotspotState;

var UNLOCKED = module.exports.UNLOCKED /* :int */ = 0;
var LOCKED = module.exports.LOCKED /* :int */ = 1;

var size = module.exports.size = 8;

function PalaceHotspotState() {
    var that = this;
    this.pictureId/* :int */;
    this.x/* :int */;
    this.y/* :int */;
    this.opacity/* :Number */ = 1;
    this.hotspotImage/* :HotSpotImage */;

    this.size = size;

    var readData = this.readData = function (endian/* :String */, roomBytes/* :Array */, offset/* :int */)/* :void */ {
//        console.log("PalaceHotspotState size:" + size);
        var ba/* :ByteArray */ = new ByteArray(that.size + 1);
        for (var j/* :int */ = offset; j < offset + that.size + 1; j++) {
            ba.writeByte(roomBytes[j]);
        }
        ba.position = 0;
        ba.endian = endian;

        that.pictureId = ba.readShort();
        ba.readShort(); // Filler for alignment
        that.y = ba.readShort();
        that.x = ba.readShort();
//        console.log("PalaceHotspotState pictureId: "+ that.pictureId + " x: " + x + " y: " + y);
    }
}

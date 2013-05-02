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

//package net.codecomposer.palace.crypto
//{
//	import flash.utils.ByteArray;
var _instance;

function PalaceEncryption() {
    var ByteArray = Buffer;
    var seed/* :int */;
    var lut/* :Array */; // look up table

    var encrypt = this.encrypt = function (message/* :String */, utf8Output/* :Boolean  = false */, byteLimit/* :int  = 254*/)/* :ByteArray */ {
        utf8Output = utf8Output || false;
        byteLimit = byteLimit || 254;

        var i/* :int */ = 0;
        var bytesIn/* :ByteArray */ = new ByteArray(1024);
        if (utf8Output) {
            bytesIn.writeUTFBytes(message);
        }
        else {
            bytesIn.writeMultiByte(message, 'Windows-1252');
        }
        if (bytesIn.getLength() > byteLimit) {
            var temp/* :ByteArray */ = bytesIn;
            bytesIn = new ByteArray(byteLimit);
            temp.position = 0;
            for (i = 0; i < byteLimit; i++) {
                bytesIn.writeByte(temp.readByte());
            }
        }
        bytesIn.position = 0;

        var original/* :Array */ = [];
        while (bytesIn.getLength() > 0) {
            original.push(bytesIn.readByte());
        }

        var lastChar/* :int */ = 0;
        var bs/* :Array */ = new Array(original.length);
        var rc/* :int */ = 0;
        for (i = original.length - 1; i >= 0; i--) {
            var b/* :int */ = original[i];
            bs[i] = (b ^ lut[rc++] ^ lastChar) & 0xff; // truncate to byte...
            lastChar = (bs[i] ^ lut[rc++]) & 0xff; // truncate to byte...
        }

        var bytesOut/* :ByteArray */ = new ByteArray(bs.length);

        for (i = 0; i < bs.length; i++) {
            bytesOut.writeByte(bs[i]);
        }
        return bytesOut;
    }

    var decrypt = this.decrypt = function (bytesIn/* :ByteArray */, utf8Input/* :Boolean  = false*/)/* :String */ {
        utf8Input = utf8Input || false;
        var lastChar/* :int */ = 0;
        var i/* :int */ = 0;

        var original/* :Array */ = [];
        while (bytesIn.getLength() > 0) {
            original.push(bytesIn.readByte());
        }

        var bs/* :Array */ = new Array(original.length);
        var rc/* :int */ = 0;
        for (i = bs.length - 1; i >= 0; i--) {
            var tmp/* :int */ = original[i];
            bs[i] = (tmp ^ lut[rc++] ^ lastChar) & 0xff;
            lastChar = (tmp ^ lut[rc++]) & 0xff;
        }

        var bytesOut/* :ByteArray */ = new ByteArray(bs.length);
        for (i = 0; i < bs.length; i++) {
            bytesOut.writeByte(bs[i]);
        }
        bytesOut.position = 0;
        if (utf8Input) {
            return bytesOut.readUTFBytes(bytesOut.length);
        }
        else {
            return bytesOut.readMultiByte(bytesOut.length, 'Windows-1252');
        }
    }

    this.PalaceEncryption = function () {
        if (PalaceEncryption._instance != null) {
            throw new Error("You can only create one instance of the singleton PalaceEncryption");
        }
        initialize();
    }()

    function initialize()/* :void */ {
        srand(0xa2c2a);
        lut = new Array(512);
        for (var i/* :int */ = 0; i < 512; i++) {
            lut[i] = shortRandom(256);
        }
        var test/* :Array */ = lut;
        srand(0);
    }

    function random()/* :int */ {
        var quotient/* :int */ = Math.floor(seed / 0x1f31d);
        var remainder/* :int */ = seed % 0x1f31d;
        var a/* :int */ = 16807 * remainder - 2836 * quotient;
        if (a > 0) {
            seed = a;
        }
        else {
            seed = a + 0x7fffffff;
        }
        return seed;
    }

    function doubleRandom()/* :Number */ {
        return Number(random()) / 2147483647.0;
    }

    function srand(s/* :int */)/* :void */ {
        seed = s;
        if (seed == 0) {
            seed = 1;
        }
    }

    function shortRandom(max/* :int */)/* :int */ {
        var a/* :int */ = (doubleRandom() * (max * 1.0));
        // truncate to short, AS3 only has 32-bit integers.
        a = a & 0x0000ffff;
        return a;
    }
}
//}
function getInstance() {
    if (_instance == null) {
        _instance = new PalaceEncryption();
    }
    return _instance;
}

module.exports = PalaceEncryption;
module.exports.getInstance = getInstance;
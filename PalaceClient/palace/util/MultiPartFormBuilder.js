//package net.codecomposer.util
//{
//	import flash.display.Bitmap;
//	import flash.display.BitmapData;
//	import flash.utils.ByteArray;
//	import flash.utils.Endian;

//	import mx.graphics.codec.PNGEncoder;
//	import mx.utils.Base64Encoder;
var UIDUtil = require("../../adapter/utils/UIDUtil");

module.exports = MultiPartFormBuilder;

function MultiPartFormBuilder(input/* :Object */, useBase64/* :Boolean  = true*/) {
    var that = this;

    this.boundary/* :String */ = UIDUtil.createUID();
    this.contentType/* :String */ = "multipart/form-data; charset=UTF-8; boundary=" + this.boundary;;
    this.input = /* :Object */input;
    var _data/* :ByteArray */;
    this.useBase64/* :Boolean */ = useBase64 !== false; // default is true
    var MultiPartFormBuilder = this.MultiPartFormBuilder = function () {

        this.useBase64 = that.useBase64;
    }

    var get_data = this.get_data = function ()/* :ByteArray */ {
        _data = new ByteArray();
        _data.endian = Endian.BIG_ENDIAN;
        var fileFieldDeferred/* :Boolean */ = false;
        for (var key/* :String */ in input) {
            if (!(key /* is String */)) {
                continue;
            }
            if (key == 'file') {
                fileFieldDeferred = true;
            }
            else if (input[key] /* is Bitmap */) {
                writeBitmap(Bitmap(input[key]).bitmapData, key);
            }
            else if (input[key] /* is Bitmap Data */) {
                writeBitmap(input[key], key);
            }
            else if (input[key] /* is String */) {
                writeString(input[key], key);
            }
            else if (input[key] /* is Number */) {
                writeString(Number(input[key]).toString(), key);
            }
            else if (input[key] == null) {
                // do nothing
            }
            else {
                writeString(input[key].toString(), key);
            }
        }

        if (fileFieldDeferred) {
            if (input['file']) {
                if (input['file'] /* is Bitmap */) {
                    writeBitmap(Bitmap(input['file']).bitmapData, 'file');
                }
                else if (input['file'] /* is Bitmap Data */) {
                    writeBitmap(BitmapData(input['file']), 'file');
                }
            }

        }

        writeEndBoundary();

        return _data;
    }

    function writeBitmap(bitmapData/* :BitmapData */, fieldName/* :String */)/* :void */ {
        var encoder/* :PNGEncoder */ = new PNGEncoder();
        var png/* :ByteArray */ = encoder.encode(bitmapData);
        var base64Encoder/* :Base64Encoder */;
        var pngBase64/* :String */;


        writeBoundary();
        _data.writeUTFBytes("Content-Disposition: form-data; name=\"" + fieldName + "\"\r\n");
        _data.writeUTFBytes("Content-Type: image/png\r\n");

        if (useBase64) {
            base64Encoder = new Base64Encoder();
            base64Encoder.encodeBytes(png);
            pngBase64 = base64Encoder.toString();
            _data.writeUTFBytes("Content-Transfer-Encoding: base64\r\n\r\n");
            _data.writeUTFBytes(pngBase64);
        }
        else {
            _data.writeUTFBytes("Content-Transfer-Encoding: binary\r\n\r\n");
            while (png.bytesAvailable) {
                _data.writeByte(png.readByte());
            }
        }
    }

    function writeString(string/* :String */, fieldName/* :String */)/* :void */ {
        writeBoundary();
        _data.writeUTFBytes("Content-Disposition: form-data; name=\"" + fieldName + "\"\r\n\r\n");
        _data.writeUTFBytes(string);
    }

    function writeBoundary()/* :void */ {
        _data.writeUTFBytes("\r\n--" + boundary + "\r\n");
    }

    function writeEndBoundary()/* :void */ {
        _data.writeUTFBytes("\r\n--" + boundary + "--\r\n");
    }

}
//}
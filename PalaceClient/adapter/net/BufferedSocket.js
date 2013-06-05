var encoding = require("encoding");

function BufferedSocket() {

}

function extendSocket(socket) {
    socket.endian = "bigEndian";
    socket.writeBuffer = new Buffer(0);
    socket.writeBufferPos = 0;

    socket.extendWriteBuffer = function (num) {

        var spaceLeft = this.writeBuffer.length - this.writeBufferPos - num;
        if (spaceLeft < 0) {
            var newLength = this.writeBuffer.length + (spaceLeft * -1);
            var newBuffer = new Buffer(newLength);
            this.writeBuffer.copy(newBuffer);
            this.writeBuffer = newBuffer;
        }
//            console.log('buffer length: ' + this.writeBuffer.length + ' buffer pos: ' + this.writeBufferPos);
    };

    socket.writeInt = function (data) {
//            console.log('writeInt Data: 0x' + data.toString(16) + " " + data);
//            console.log('writeInt Binary: ' + data.toString(2));
        this.extendWriteBuffer(4);
        //var buffer = new Buffer(4);
        if (socket.endian == "littleEndian") {
            this.writeBuffer.writeUInt32LE(data, this.writeBufferPos);
        } else {
            this.writeBuffer.writeUInt32BE(data, this.writeBufferPos);
        }
        this.writeBufferPos += 4;
        //socket.write(buffer);
    };
    socket.writeUnsignedInt = socket.writeInt;

    socket.writeByte = function (data) {
//            var buffer = new Buffer(1);
        this.extendWriteBuffer(1);
        this.writeBuffer.writeInt8(data, this.writeBufferPos);
        this.writeBufferPos += 1;
//            console.log('sending Byte: ',buffer.toString('hex'));
//            socket.write(buffer);
    };

    socket.writeBytes = function (tmpBuffer) {
        this.extendWriteBuffer(tmpBuffer.length);
        tmpBuffer.copy(this.writeBuffer, this.writeBufferPos);
        this.writeBufferPos += tmpBuffer.length;
    };

    socket.writeMultiByte = function (data, encoding) {
        //console.log('sending MultyByte: ', data);
        // temporary write just utf8.. encoding later...
        var tmpBuffer = new Buffer(data);
        this.extendWriteBuffer(tmpBuffer.length);
        tmpBuffer.copy(this.writeBuffer, this.writeBufferPos);
        this.writeBufferPos += tmpBuffer.length;
        //socket.write(data);
    };

    socket.writeShort = function (data) {
        data = parseInt(data);
        this.extendWriteBuffer(2);
        if (socket.endian == "littleEndian") {
            this.writeBuffer.writeInt16LE(data, this.writeBufferPos);
        } else {
            this.writeBuffer.writeInt16BE(data, this.writeBufferPos);
        }
        this.writeBufferPos += 2;
//            console.log('sending Short: ', buffer.toString('hex'));
//            socket.write(buffer);
    };
    socket.flush = function () {
        //console.log('write Data: 0x' + this.writeBuffer.toString('hex'));
        //console.log('write Bin :   ' + this.writeBuffer.toString('utf8'));
        this.write(this.writeBuffer);
        this.writeBufferPos = 0;
        this.writeBuffer = new Buffer(0);
    };
    socket.close = function () {
        this.end();
    };
}


function extendBuffer(socket) {
    //if (!Buffer.prototype.readInt) { // only extend it once
    console.log('extend buffer');
    Buffer.prototype.position = 0;
    Buffer.prototype.endian = "bigEndian"; //default
    Buffer.prototype.readInt = function () {
//            trace('position: ' + this.position);
        var endian = socket.endian || this.endian;
        if (endian == "littleEndian") {
            var value = this.readInt32LE(this.position);
        } else if (endian == "bigEndian") {
            var value = this.readInt32BE(this.position);
        }
        this.position = this.position + 4;
        return value;
    };
    Buffer.prototype.readUnsignedInt = function () {
//            trace('position: ' + this.position);
        var endian = socket.endian || this.endian;
        if (endian == "littleEndian") {
            var value = this.readUInt32LE(this.position);
        } else if (endian == "bigEndian") {
            var value = this.readUInt32BE(this.position);
        }
        this.position = this.position + 4;
        return value;
    };
    Buffer.prototype.readShort = function () {
//            trace('position: ' + this.position);
        var endian = socket.endian || this.endian;
        if (endian == "littleEndian") {
            var value = this.readInt16LE(this.position);
        } else if (endian == "bigEndian") {
            var value = this.readInt16BE(this.position);
        }
        this.position = this.position + 2;
        return value;
    };

    Buffer.prototype.readUnsignedShort = function () {
//            trace('position: ' + this.position);
        var endian = socket.endian || this.endian;
        if (endian == "littleEndian") {
            var value = this.readUInt16LE(this.position);
        } else if (endian == "bigEndian") {
            var value = this.readUInt16BE(this.position);
        }
        this.position = this.position + 2;
        return value;
    };

    Buffer.prototype.readUnsignedByte = function () {
//            trace('position: ' + this.position);
        var value = this.readUInt8(this.position);
        this.position = this.position + 1;
        return value;
    };
    Buffer.prototype.readByte = function () {
//            trace('position: ' + this.position);
        var value = this.readUInt8(this.position);
        this.position = this.position + 1;
        return value;
    };
    Buffer.prototype.readBytes = function (outBuffer, start, end) {
//            trace('position: ' + this.position);
        //outBuffer = new Buffer(end - start);
        this.copy(outBuffer, 0, this.position + start, this.position + end);
        this.position = this.position + end - start;
        //console.log(outBuffer);
    };

    Buffer.prototype.readMultiByte = function (length, charset) {
//            trace('position: ' + this.position);
        var stringLength = this.getCstringLength(this, length);

        var tmpBuffer = new Buffer(stringLength);
        this.copy(tmpBuffer, 0, this.position, this.position + stringLength);
        var value = encoding.convert(tmpBuffer, 'utf-8', charset).toString('utf-8');

        //var valueHex = this.toString('hex', this.position, this.position + length );
        //console.log("multibyte-length " +length + ", string: " + value + ", hex: " + valueHex);
        this.position = this.position + length;
        return value;
    };

    Buffer.prototype.readUTFBytes = function (number) {
//            trace('position: ' + this.position);
        var value = this.toString('utf-8', this.position, this.position + number);
        this.position = this.position + number;
        return value;
    };


    Buffer.prototype.getLength = function () {
//            trace('getLength: ' + (this.length - this.position));
        return (this.length - this.position);
    };

    Buffer.prototype.__defineGetter__("bytesAvailable", function(){
        return (this.length - this.position);
    });

    Buffer.prototype.writeByte = function (oneByte) {
        this.writeUInt8(oneByte, this.position);
        this.position++;
    };

    Buffer.prototype.writeUTFBytes = function (string) {
        var bytesWritten = this.write(string, this.position);
        this.position = this.position + bytesWritten;
        return bytesWritten;
    };

    Buffer.prototype.writeMultiByte = function (data, charset) {
        //console.log('sending MultyByte: ', data);
        data = encoding.convert(data, charset);
        var bytesWritten = this.write(data, this.position);
        this.position = this.position + bytesWritten;
        return bytesWritten;
    };

    /**
     * Gets the length of a null-terminated C-String (or full length if not terminated)
     **/
    Buffer.prototype.getCstringLength = function (buffer, length) {
        for (var i = 0; i < length; i++) {
            if (buffer[buffer.position + i] === 0) {
                length = i;
                break;
            }
        }
        return length;
    };

//    }

}


module.exports = BufferedSocket;
module.exports.extendSocket = extendSocket;
module.exports.extendBuffer = extendBuffer;
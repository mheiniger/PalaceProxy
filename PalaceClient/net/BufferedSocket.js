function BufferedSocket() {

}

function extendSocket(socket) {
    socket.endian = "bigEndian";
    socket.writeBuffer = new Buffer(0);
    socket.writeBufferPos = 0;

    socket.extendWriteBuffer = function(num) {

        var spaceLeft = this.writeBuffer.length - this.writeBufferPos - num;
        if (spaceLeft < 0) {
            var newLength = this.writeBuffer.length + (spaceLeft * -1);
            var newBuffer = new Buffer(newLength);
            this.writeBuffer.copy(newBuffer);
            this.writeBuffer = newBuffer;
        }
//            console.log('buffer length: ' + this.writeBuffer.length + ' buffer pos: ' + this.writeBufferPos);
    }

    socket.writeInt = function(data) {
//            console.log('writeInt Data: 0x' + data.toString(16) + " " + data);
//            console.log('writeInt Binary: ' + data.toString(2));
        this.extendWriteBuffer(4)
        //var buffer = new Buffer(4);
        if (socket.endian == "littleEndian") {
            this.writeBuffer.writeUInt32LE(data, this.writeBufferPos);
        } else {
            this.writeBuffer.writeUInt32BE(data, this.writeBufferPos);
        }
        this.writeBufferPos += 4;
        //socket.write(buffer);
    }

    socket.writeByte = function (data) {
//            var buffer = new Buffer(1);
        this.extendWriteBuffer(1);
        this.writeBuffer.writeInt8(data, this.writeBufferPos);
        this.writeBufferPos += 1;
//            console.log('sending Byte: ',buffer.toString('hex'));
//            socket.write(buffer);
    }

    socket.writeMultiByte = function (data, encoding) {
        //console.log('sending MultyByte: ', data);
        // temporary write just utf8.. encoding later...
        var tmpBuffer = new Buffer(data);
        this.extendWriteBuffer(tmpBuffer.length);
        tmpBuffer.copy(this.writeBuffer, this.writeBufferPos);
        this.writeBufferPos += tmpBuffer.length;
        //socket.write(data);
    }

    socket.writeShort = function (data) {
//            var buffer = new Buffer(2);
        this.extendWriteBuffer(2);
        if (socket.endian == "littleEndian") {
            this.writeBuffer.writeInt16LE(data, this.writeBufferPos);
        } else {
            this.writeBuffer.writeInt16BE(data, this.writeBufferPos);
        }
        this.writeBufferPos += 2;
//            console.log('sending Short: ', buffer.toString('hex'));
//            socket.write(buffer);
    }
    socket.flush = function() {
        console.log('write Data: 0x' + this.writeBuffer.toString('hex'));
        console.log('write Bin :   ' + this.writeBuffer.toString('utf8'));
        this.write(this.writeBuffer);
        this.writeBufferPos = 0;
        this.writeBuffer = new Buffer(0);
    }
}

module.exports = BufferedSocket;
module.exports.extendSocket = extendSocket;
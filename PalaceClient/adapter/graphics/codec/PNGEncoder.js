PNG = require('pngjs').PNG;

module.exports = PNGEncoder;

function PNGEncoder() {


    this.encode = function (data, width, height) {


        var png = new PNG({
            width: width,
            height: height
        });

//        var buffer = new Buffer(data.length * 4);
//
//        for (var i; i < data.length; i++) {
//            buffer[i * 4] = data[i] & 0xFF000000;
//            buffer[i * 4 + 1] = data[i] & 0x00FF0000;
//            buffer[i * 4 + 2] = data[i] & 0x0000FF00;
//            buffer[i * 4 + 3] = data[i] & 0x000000FF;
//
//        }

        png.data = data;

//        for (var y = 0; y < this.height; y++) {
//            for (var x = 0; x < this.width; x++) {
//                var idx = (this.width * y + x) << 2;
//
//                // invert color
//                this.data[idx] = 255 - this.data[idx];
//                this.data[idx+1] = 255 - this.data[idx+1];
//                this.data[idx+2] = 255 - this.data[idx+2];
//
//                // and reduce opacity
//                this.data[idx+3] = this.data[idx+3] >> 1;
//            }
//        }

        return png.pack();
    }
}
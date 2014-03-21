var Png = require('png').Png;

module.exports = PNGEncoder;

function PNGEncoder() {
    this.encode = function (data, width, height, type) {
        var type = type || 'rgba';
        var png = new Png(new Buffer(data), width, height, type);
        return png.encodeSync();
    }
}

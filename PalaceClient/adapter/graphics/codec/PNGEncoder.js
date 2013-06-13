var Png = require('png').Png;

module.exports = PNGEncoder;

function PNGEncoder() {
    this.encode = function (data, width, height) {
        var png = new Png(data, width, height, 'rgba');
        return png.encodeSync();
    }
}
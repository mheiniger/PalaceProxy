var PNGEncoder = require("../../PalaceClient/adapter/graphics/codec/PNGEncoder.js");
var fs = require('fs');

var pngEncoder = new PNGEncoder();

var data = new Buffer(800);

var i;
for (i = 0; i < 200; i++) {
    data.writeUInt32BE(0x00FF0000, i * 4);
}
//console.log(JSON.stringify(data));
//pngEncoder.on('data', function (data){
//    console.log(data);
//});
var png = pngEncoder.encode(data, 50, 4);
fs.writeFileSync('./png-50x4.png', png.toString('binary'), 'binary');
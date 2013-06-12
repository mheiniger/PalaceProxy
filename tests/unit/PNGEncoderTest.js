PNGEncoder = require("../../PalaceClient/adapter/graphics/codec/PNGEncoder.js");

pngEncoder = new PNGEncoder();

var data = new Buffer(200);

var i;
for (i = 0; i<50 ; i++){
    console.log(i);
    data.writeUInt32BE(0xFF000000, i*4);
}
console.log(JSON.stringify(data));
pngEncoder.encode(data, 50,4);
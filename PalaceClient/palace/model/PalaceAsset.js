module.exports = PalaceAsset;

var ASSET_TYPE_PROP = module.exports.ASSET_TYPE_PROP/* :int */ = 0x50726f70;
var ASSET_TYPE_USERBASE = module.exports.ASSET_TYPE_USERBASE/* :int */ = 0x55736572;
var ASSET_TYPE_IPUSERBASE = module.exports.ASSET_TYPE_IPUSERBASE/* :int */ = 0x49557372;

function PalaceAsset() {
    this.id/* :int */;
    this.crc/* :uint */;
    this.guid/* :String */;
    this.temporaryIdentifier/* :String */;
    this.imageDataURL/* :String */;
    this.type/* :int */;
    this.name/* :String */;
    this.flags/* :uint */;
    this.blockSize/* :int */;
    this.blockCount/* :int */;
    this.blockOffset/* :int */;
    this.blockNumber/* :int */;
    this.data/* :Array */;

}
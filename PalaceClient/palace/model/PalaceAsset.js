module.exports = PalaceAsset;

var ASSET_TYPE_PROP = module.exports.ASSET_TYPE_PROP/* :int */ = 0x50726f70;
var ASSET_TYPE_USERBASE = module.exports.ASSET_TYPE_USERBASE/* :int */ = 0x55736572;
var ASSET_TYPE_IPUSERBASE = module.exports.ASSET_TYPE_IPUSERBASE/* :int */ = 0x49557372;

function PalaceAsset() {
    this.id/* :int */ = 0;
    this.crc/* :uint */ = 0;
    this.guid/* :String */ = "";
    this.temporaryIdentifier/* :String */ = "";
    this.imageDataURL/* :String */ = "";
    this.type/* :int */ = 0;
    this.name/* :String */ = "";
    this.flags/* :uint */ = 0;
    this.blockSize/* :int */ = 0;
    this.blockCount/* :int */ = 0;
    this.blockOffset/* :int */ = 0;
    this.blockNumber/* :int */= 0;
    this.data/* :Array */ = [];
}
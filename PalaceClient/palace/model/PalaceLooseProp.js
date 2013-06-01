var util = require('util');
var EventDispatcher = require("../../adapter/events/EventDispatcher");
var ByteArray = Buffer;

var PropEvent = require("./../event/PropEvent");

module.exports = PalaceLooseProp;
var dataSize = module.exports.dataSize /* :int */ = 24;

util.inherits(PalaceLooseProp, EventDispatcher);
function PalaceLooseProp() {
    PalaceLooseProp.super_.call(this);
    var that = this;

    this.nextOffset/* :int */ = 0;
    this.id/* :uint */ = 0;
    this.crc/* :uint */ = 0;
    this.guid/* :String */ = 0;
    this.flags/* :uint */ = 0;
    this.x/* :int */ = 0;
    this.y/* :int */ = 0;
    this.prop/* :PalaceProp */ = {};

    var propStore/* :PalaceProp Store */ = {}; // PalacePropStore.getInstance();

    this.dataSize = dataSize;

    this.loadData = function (endian/* :String */, bs/* :Array */, offset/* :int */)/* :void */ {
        var ba/* :ByteArray */ = new ByteArray(dataSize + 1);
        for (var j/* :int */ = offset; j < offset + dataSize + 1; j++) {
            ba.writeByte(bs[j]);
        }
        ba.position = 0;
        ba.endian = endian;

        that.nextOffset = ba.readShort();
        ba.readShort();
        that.id = ba.readUnsignedInt();
        that.crc = ba.readUnsignedInt();
        that.flags = ba.readUnsignedInt();
        ba.readInt();
        that.y = ba.readShort();
        that.x = ba.readShort();
    };

    this.loadProp = function ()/* :void */ {
//        that.prop = that.propStore.getProp(guid, id, crc);
//        that.prop.addEventListener(PropEvent.PROP_LOADED, handlePropLoaded);
    };

    function handlePropLoaded(event/* :PropEvent */)/* :void */ {
        var loosePropLoadedEvent/* :PropEvent */ = new PropEvent(PropEvent.LOOSE_PROP_LOADED);
        dispatchEvent(loosePropLoadedEvent);
    }

    function dispatchEvent(object) {
        console.log("PalaceLooseProp dispatches event: " + object.type);
        that.dispatchEvent(object.type, object);
    }

}
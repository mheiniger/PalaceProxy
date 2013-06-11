module.exports = BitmapData;

function BitmapData (width /* :int*/ , height /*:int*/, transparent /* :Boolean = true*/) {
    this.setVector = function(rect/*:Rectangle*/, inputVector /*:Vector.<uint>*/){
        for (var y = rect.y; y < rect.height; y++) {
            for (var x = rect.x; x < rect.width; x++) {

            }
        }
    }
}
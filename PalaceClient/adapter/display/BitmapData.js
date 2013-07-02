module.exports = BitmapData;

function BitmapData (width /* :int*/ , height /*:int*/, transparent /* :Boolean = true*/) {
    var _bitmapData;
    this.width = width;
    this.height = height;
    this.transparent = transparent;

    this.setVector = this.set = function(rect, bitmapData){
        _bitmapData = bitmapData;
    }

    this.get = function(){
        return _bitmapData;
    }
}
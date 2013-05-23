//	import org.openpalace.iptscrae.IptTokenList;
module.exports = PalaceChatRecord;
var INCHAT = module.exports.INCHAT/* :int */ = 0;
var OUTCHAT = module.exports.OUTCHAT/* :int */ = 1;

function PalaceChatRecord(direction/* :int */, whochat/* :int */, whotarget/* :int */, chatstr/* :String */, isWhisper/* :Boolean */) {
    this.direction = direction || INCHAT/* :int */;
    this.whochat = whochat || 0/* :int */;
    this.whotarget = whotarget || 0/* :int */;
    this.chatstr = chatstr || ""/* :String */;
    this.whisper = isWhisper || false/* :Boolean */;
    this.eventHandlers = []/* :Vector.<IptTokenList> */;
    var _originalChatstr = chatstr/* :String */;

   this.get_originalChatstr = function ()/* :String */ {
        return _originalChatstr;
    }
}

//	import org.openpalace.iptscrae.IptTokenList;
module.exports = PalaceChatRecord;
var INCHAT = module.exports.INCHAT/* :int */ = 0;
var OUTCHAT = module.exports.OUTCHAT/* :int */ = 1;

function PalaceChatRecord(direction/* :int */, whochat/* :int */, whotarget/* :int */, chatstr/* :String */, isWhisper/* :Boolean */) {
    var direction = this.direction = direction || INCHAT;/* :int */;
    var whochat = this.whochat = whochat || 0/* :int */;
    var whotarget = this.whotarget = whotarget || 0/* :int */;
    var chatstr = this.chatstr = chatstr || ""/* :String */;
    var whisper = this.whisper = isWhisper || false/* :Boolean */;
    var eventHandlers = this.eventHandlers/* :Vector.<IptTokenList> */;
    var _originalChatstr = chatstr/* :String */;

   this.get_originalChatstr = function ()/* :String */ {
        return _originalChatstr;
    }
}

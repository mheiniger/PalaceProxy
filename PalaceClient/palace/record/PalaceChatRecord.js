//package net.codecomposer.palace.record
//{
//	import org.openpalace.iptscrae.IptTokenList;

function PalaceChatRecord(direction/* :int */, whochat/* :int */, whotarget/* :int */, chatstr/* :String */, isWhisper/* :Boolean */) {
    this.constants = {};
    var INCHAT = this.constants.INCHAT/* :int */ = 0;
    var OUTCHAT = this.constants.OUTCHAT/* :int */ = 1;

    var direction = this.direction = direction || INCHAT;/* :int */;
    var whochat = this.whochat = whochat || 0/* :int */;
    var whotarget = this.whotarget = whotarget || 0/* :int */;
    var chatstr = this.chatstr = chatstr || ""/* :String */;
    var whisper = this.whisper = isWhisper || false/* :Boolean */;
    var eventHandlers = this.eventHandlers/* :Vector.<IptTokenList> */;
    var _originalChatstr = chatstr/* :String */;

//    this.PalaceChatRecordConstructor = function () {
//        this.direction = direction || INCHAT;
//        this.whochat = whochat || 0;
//        this.whotarget = whotarget || 0;
//        this.chatstr = chatstr || "";
//        this.whisper = isWhisper || false;
//        this._originalChatstr = chatstr;
//    }

    var get_originalChatstr = this.get_originalChatstr = function ()/* :String */ {
        return _originalChatstr;
    }
}
//}

module.exports = PalaceChatRecord;
var PalaceChatRecordVar = new PalaceChatRecord();
for (name in PalaceChatRecordVar.constants) {
    module.exports[name] = PalaceChatRecordVar.constants[name];
}
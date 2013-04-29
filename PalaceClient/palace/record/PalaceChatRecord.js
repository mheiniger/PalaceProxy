//package net.codecomposer.palace.record
//{
//	import org.openpalace.iptscrae.IptTokenList;

	function PalaceChatRecord()
	{
    this.constants = {};
		var INCHAT = this.constants.INCHAT/* :int */ = 0;
		var OUTCHAT = this.constants.OUTCHAT/* :int */ = 1;
		
		var direction = this.direction/* :int */;
		var whochat = this.whochat/* :int */;
		var whotarget = this.whotarget/* :int */;
		var chatstr = this.chatstr/* :String */;
		var whisper = this.whisper/* :Boolean */;
		var eventHandlers = this.eventHandlers/* :Vector.<IptTokenList> */;
		var _originalChatstr/* :String */;
		
		var PalaceChatRecord = this.PalaceChatRecord = function(direction/* :int */ , whochat/* :int */ , whotarget/* :int */ , chatstr/* :String */, isWhisper/* :Boolean */)
		{
			this.direction = direction || INCHAT;
			this.whochat = whochat || 0;
			this.whotarget = whotarget || 0;
			this.chatstr = chatstr || "";
			this.whisper = isWhisper || false;
			this._originalChatstr = chatstr;
		}
		
		var get_originalChatstr = this.get_originalChatstr = function()/* :String */ {
			return _originalChatstr;
		}
	}
//}

module.exports = PalaceChatRecord;
var PalaceChatRecordVar = new PalaceChatRecord();
for (name in PalaceChatRecordVar.constants) {
   module.exports[name] = PalaceChatRecordVar.constants[name];
}
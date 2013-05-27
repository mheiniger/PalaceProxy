/*
 This file is part of OpenPalace.

 OpenPalace is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 OpenPalace is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with OpenPalace.  If not, see <http://www.gnu.org/licenses/>.
 */

//package net.codecomposer.palace.event
//{
var Event = require("./../../adapter/events/Event.js"); //	import flash.events.Event;
var util = require("util");


//	import net.codecomposer.palace.model.PalaceUser;

module.exports = ChatEvent;
var CHAT = module.exports.CHAT /* :String */ = "chat";
var WHISPER = module.exports.WHISPER /* :String */ = "whisper";
var ROOM_MESSAGE = module.exports.ROOM_MESSAGE /* :String */ = "roomMessage";

util.inherits(ChatEvent, Event);
function ChatEvent(type/* :String */, chatText/* :String */, user/* :PalaceUser = null*/) //extends Event
{
    this.logText/* :String */ = chatText;
    this.user/* :PalaceUser */;
    this.soundName/* :String */;
    this.whisper/* :Boolean */;
    this.logOnly/* :Boolean */ = false;

    var match/* :Array */;
    if (chatText.charAt(0) == ';' || chatText.charAt(0) == "%") {
        this.logOnly = true;
    }

    match = chatText.match(/^\s*(@\d+,\d+){0,1}\s*\)([^\s]+)\s*(.*)$/);
    if (match && match.length > 1) {
        this.soundName = match[2];
        chatText = "";
        if (match[1]) {
            chatText += match[1];
        }
        if (match[3]) {
            chatText += match[3];
        }
    }

    this.chatText = chatText;
    this.user = user || null;
    this.whisper = Boolean(type == WHISPER);
    ChatEvent.super_.call(this, type);
}

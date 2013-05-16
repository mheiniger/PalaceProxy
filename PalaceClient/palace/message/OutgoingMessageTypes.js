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
module.exports = OutgoingMessageTypes;

// ----------------------------------------------------------------------
// To Server
// ----------------------------------------------------------------------
module.exports.BYE/* :int */ = 0x62796520;
module.exports.PING_BACK/* :int */ = 0x706f6e67;
module.exports.SAY/* :int */ = 0x78746c6b;
module.exports.WHISPER/* :int */ = 0x78776973;
module.exports.MOVE/* :int */ = 1967943523;
module.exports.USER_COLOR/* :int */ = 1970500163;
module.exports.USER_FACE/* :int */ = 0x75737246;
module.exports.REQUEST_ROOM_LIST/* :int */ = 0x724c7374;
module.exports.GOTO_ROOM/* :int */ = 0x6e617652;
module.exports.REQUEST_USER_LIST/* :int */ = 0x754c7374;
module.exports.REQUEST_ASSET/* :int */ = 0x71417374;
module.exports.USER_PROP/* :int */ = 1970500176;
module.exports.CHANGE_NAME/* :int */ = 0x7573724e;
module.exports.BLOWTHRU/* :int */ = 0x626c6f77;
module.exports.SPOT_STATE/* :int */ = 1934849121;
module.exports.DOOR_LOCK/* :int */ = 1819239275;
module.exports.DOOR_UNLOCK/* :int */ = 1970170991;
module.exports.SUPERUSER/* :int */ = 0x73757372;
module.exports.LOGON/* :int */ = 0x72656769;
module.exports.PROP_MOVE/* :int */ = 1833988720;
module.exports.PROP_DELETE/* :int */ = 1682993776;
module.exports.PROP_NEW/* :int */ = 1850765936;
module.exports.ASSET_REGI/* :int */ = 0x72417374;
module.exports.GLOBAL_MSG/* :int */ = 0x676d7367;
module.exports.ROOM_MSG/* :int */ = 0x726d7367;
module.exports.SUSR_MSG/* :int */ = 0x736d7367;
module.exports.AUTHRESPONSE/* :int */ = 0x61757472;
module.exports.DRAW/* :int */ = 0x64726177;

function OutgoingMessageTypes() {
}



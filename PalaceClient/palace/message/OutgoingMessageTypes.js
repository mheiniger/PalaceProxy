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

// ----------------------------------------------------------------------
// To Server
// ----------------------------------------------------------------------
var constants = {};
constants.BYE/* :int */ = 0x62796520;
constants.PING_BACK/* :int */ = 0x706f6e67;
constants.SAY/* :int */ = 0x78746c6b;
constants.WHISPER/* :int */ = 0x78776973;
constants.MOVE/* :int */ = 1967943523;
constants.USER_COLOR/* :int */ = 1970500163;
constants.USER_FACE/* :int */ = 0x75737246;
constants.REQUEST_ROOM_LIST/* :int */ = 0x724c7374;
constants.GOTO_ROOM/* :int */ = 0x6e617652;
constants.REQUEST_USER_LIST/* :int */ = 0x754c7374;
constants.REQUEST_ASSET/* :int */ = 0x71417374;
constants.USER_PROP/* :int */ = 1970500176;
constants.CHANGE_NAME/* :int */ = 0x7573724e;
constants.BLOWTHRU/* :int */ = 0x626c6f77;
constants.SPOT_STATE/* :int */ = 1934849121;
constants.DOOR_LOCK/* :int */ = 1819239275;
constants.DOOR_UNLOCK/* :int */ = 1970170991;
constants.SUPERUSER/* :int */ = 0x73757372;
constants.LOGON/* :int */ = 0x72656769;
constants.PROP_MOVE/* :int */ = 1833988720;
constants.PROP_DELETE/* :int */ = 1682993776;
constants.PROP_NEW/* :int */ = 1850765936;
constants.ASSET_REGI/* :int */ = 0x72417374;
constants.GLOBAL_MSG/* :int */ = 0x676d7367;
constants.ROOM_MSG/* :int */ = 0x726d7367;
constants.SUSR_MSG/* :int */ = 0x736d7367;
constants.AUTHRESPONSE/* :int */ = 0x61757472;
constants.DRAW/* :int */ = 0x64726177;

function OutgoingMessageTypes() {}

module.exports = OutgoingMessageTypes

for (constant in constants) {
    module.exports[constant] = constants[constant];
}
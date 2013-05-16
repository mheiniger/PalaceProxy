module.exports = IncomingMessageTypes;
// ----------------------------------------------------------------------
// From Server
// ----------------------------------------------------------------------

// Server Types
module.exports.UNKNOWN_SERVER/* :int */ = 1886610802;
module.exports.LITTLE_ENDIAN_SERVER/* :int */ = 1920559476;
module.exports.BIG_ENDIAN_SERVER/* :int */ = 1953069426;

// Login
module.exports.ALTERNATE_LOGON_REPLY/* :int */ = 1919250482;

module.exports.SERVER_VERSION/* :int */ = 1986359923;
module.exports.SERVER_INFO/* :int */ = 1936289382;
module.exports.USER_STATUS/* :int */ = 1968403553;
module.exports.USER_LOGGED_ON_AND_MAX/* :int */ = 1819240224;
module.exports.GOT_HTTP_SERVER_LOCATION/* :int */ = 1213486160;

// the following four are whenever you change rooms as well as login
module.exports.GOT_ROOM_DESCRIPTION/* :int */ = 1919905645;
module.exports.GOT_ROOM_DESCRIPTION_ALT/* :int */ = 1934782317;
module.exports.GOT_USER_LIST/* :int */ = 1919971955;
module.exports.GOT_ROOM_LIST/* :int */ = 1917612916;
module.exports.ROOM_DESCEND/* :int */ = 1701733490; // ???
module.exports.USER_NEW/* :int */ = 1852863091;

module.exports.PINGED/* :int */ = 1885957735;

module.exports.XTALK/* :int */ = 0x78746c6b; // Encrypted
module.exports.XWHISPER/* :int */ = 0x78776973; // Encrypted
module.exports.TALK/* :int */ = 0x74616C6B; // Unencrypted
module.exports.WHISPER/* :int */ = 0x77686973; // Unencrypted
module.exports.MOVEMENT/* :int */ = 1967943523;
module.exports.USER_COLOR/* :int */ = 1970500163;
module.exports.USER_FACE/* :int */ = 1970500166;
module.exports.USER_DESCRIPTION/* :int */ = 1970500164;
module.exports.USER_PROP/* :int */ = 1970500176;
module.exports.USER_RENAME/* :int */ = 1970500174;
module.exports.USER_LEAVING/* :int */ = 1652122912; // ?
module.exports.CONNECTION_DIED/* :int */ = 1685026670;
module.exports.INCOMING_FILE/* :int */ = 1933994348;
module.exports.ASSET_INCOMING/* :int */ = 1933669236;
module.exports.USER_EXIT_ROOM/* :int */ = 1701868147;
module.exports.GOT_REPLY_OF_ALL_ROOMS/* :int */ = 1917612916;
module.exports.GOT_REPLY_OF_ALL_USERS/* :int */ = 1967944564;

module.exports.DOOR_LOCK/* :int */ = 1819239275;
module.exports.DOOR_UNLOCK/* :int */ = 1970170991;
module.exports.SPOT_STATE/* :int */ = 1934849121;
module.exports.SPOT_MOVE/* :int */ = 1668238451;
module.exports.PICT_MOVE/* :int */ = 1884057443;
module.exports.DRAW_CMD/* :int */ = 1685217655;
// Loose Props
module.exports.PROP_MOVE/* :int */ = 1833988720;
module.exports.PROP_DELETE/* :int */ = 1682993776;
module.exports.PROP_NEW/* :int */ = 1850765936;

// Assets
module.exports.ASSET_QUERY/* :int */ = 1900114804;

// Status...
module.exports.NAV_ERROR/* :int */ = 1933931122;
module.exports.SERVER_DOWN/* :int */ = 1685026670;

// Blowthru...
module.exports.BLOWTHRU/* :int */ = 1651273591;

// Authentication...
module.exports.AUTHENTICATE/* :int */ = 0x61757468;

function IncomingMessageTypes() {
}

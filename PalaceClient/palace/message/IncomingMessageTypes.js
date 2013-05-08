// ----------------------------------------------------------------------
// From Server
// ----------------------------------------------------------------------
var constants = {};

// Server Types
constants.UNKNOWN_SERVER/* :int */ = 1886610802;
constants.LITTLE_ENDIAN_SERVER/* :int */ = 1920559476;
constants.BIG_ENDIAN_SERVER/* :int */ = 1953069426;

// Login
constants.ALTERNATE_LOGON_REPLY/* :int */ = 1919250482;

constants.SERVER_VERSION/* :int */ = 1986359923;
constants.SERVER_INFO/* :int */ = 1936289382;
constants.USER_STATUS/* :int */ = 1968403553;
constants.USER_LOGGED_ON_AND_MAX/* :int */ = 1819240224;
constants.GOT_HTTP_SERVER_LOCATION/* :int */ = 1213486160;

// the following four are whenever you change rooms as well as login
constants.GOT_ROOM_DESCRIPTION/* :int */ = 1919905645;
constants.GOT_ROOM_DESCRIPTION_ALT/* :int */ = 1934782317;
constants.GOT_USER_LIST/* :int */ = 1919971955;
constants.GOT_ROOM_LIST/* :int */ = 1917612916;
constants.ROOM_DESCEND/* :int */ = 1701733490; // ???
constants.USER_NEW/* :int */ = 1852863091;

constants.PINGED/* :int */ = 1885957735;

constants.XTALK/* :int */ = 0x78746c6b; // Encrypted
constants.XWHISPER/* :int */ = 0x78776973; // Encrypted
constants.TALK/* :int */ = 0x74616C6B; // Unencrypted
constants.WHISPER/* :int */ = 0x77686973; // Unencrypted
constants.MOVEMENT/* :int */ = 1967943523;
constants.USER_COLOR/* :int */ = 1970500163;
constants.USER_FACE/* :int */ = 1970500166;
constants.USER_DESCRIPTION/* :int */ = 1970500164;
constants.USER_PROP/* :int */ = 1970500176;
constants.USER_RENAME/* :int */ = 1970500174;
constants.USER_LEAVING/* :int */ = 1652122912; // ?
constants.CONNECTION_DIED/* :int */ = 1685026670;
constants.INCOMING_FILE/* :int */ = 1933994348;
constants.ASSET_INCOMING/* :int */ = 1933669236;
constants.USER_EXIT_ROOM/* :int */ = 1701868147;
constants.GOT_REPLY_OF_ALL_ROOMS/* :int */ = 1917612916;
constants.GOT_REPLY_OF_ALL_USERS/* :int */ = 1967944564;

constants.DOOR_LOCK/* :int */ = 1819239275;
constants.DOOR_UNLOCK/* :int */ = 1970170991;
constants.SPOT_STATE/* :int */ = 1934849121;
constants.SPOT_MOVE/* :int */ = 1668238451;
constants.PICT_MOVE/* :int */ = 1884057443;
constants.DRAW_CMD/* :int */ = 1685217655;
// Loose Props
constants.PROP_MOVE/* :int */ = 1833988720;
constants.PROP_DELETE/* :int */ = 1682993776;
constants.PROP_NEW/* :int */ = 1850765936;

// Assets
constants.ASSET_QUERY/* :int */ = 1900114804;

// Status...
constants.NAV_ERROR/* :int */ = 1933931122;
constants.SERVER_DOWN/* :int */ = 1685026670;

// Blowthru...
constants.BLOWTHRU/* :int */ = 1651273591;

// Authentication...
constants.AUTHENTICATE/* :int */ = 0x61757468;

function IncomingMessageTypes() {
}

module.exports = IncomingMessageTypes;
for (constant in constants) {
    module.exports[constant] = constants[constant];
}


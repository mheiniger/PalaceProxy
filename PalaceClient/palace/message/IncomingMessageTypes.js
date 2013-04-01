function IncomingMessageTypes() {
// ----------------------------------------------------------------------
    // From Server
    // ----------------------------------------------------------------------

    // Server Types
    this.UNKNOWN_SERVER/* :int */ = 1886610802;
    this.LITTLE_ENDIAN_SERVER/* :int */ = 1920559476;
    this.BIG_ENDIAN_SERVER/* :int */ = 1953069426;

    // Login
    this.ALTERNATE_LOGON_REPLY/* :int */ = 1919250482;

    this.SERVER_VERSION/* :int */ = 1986359923;
    this.SERVER_INFO/* :int */ = 1936289382;
    this.USER_STATUS/* :int */ = 1968403553;
    this.USER_LOGGED_ON_AND_MAX/* :int */ = 1819240224;
    this.GOT_HTTP_SERVER_LOCATION/* :int */ = 1213486160;

    // the following four are whenever you change rooms as well as login
    this.GOT_ROOM_DESCRIPTION/* :int */ = 1919905645;
    this.GOT_ROOM_DESCRIPTION_ALT/* :int */ = 1934782317;
    this.GOT_USER_LIST/* :int */ = 1919971955;
    this.GOT_ROOM_LIST/* :int */ = 1917612916;
    this.ROOM_DESCEND/* :int */ = 1701733490; // ???
    this.USER_NEW/* :int */ = 1852863091;

    this.PINGED/* :int */ = 1885957735;

    this.XTALK/* :int */ = 0x78746c6b; // Encrypted
    this.XWHISPER/* :int */ = 0x78776973; // Encrypted
    this.TALK/* :int */ = 0x74616C6B; // Unencrypted
    this.WHISPER/* :int */ = 0x77686973; // Unencrypted
    this.MOVEMENT/* :int */ = 1967943523;
    this.USER_COLOR/* :int */ = 1970500163;
    this.USER_FACE/* :int */ = 1970500166;
    this.USER_DESCRIPTION/* :int */ = 1970500164;
    this.USER_PROP/* :int */ = 1970500176;
    this.USER_RENAME/* :int */ = 1970500174;
    this.USER_LEAVING/* :int */ = 1652122912; // ?
    this.CONNECTION_DIED/* :int */ = 1685026670;
    this.INCOMING_FILE/* :int */ = 1933994348;
    this.ASSET_INCOMING/* :int */ = 1933669236;
    this.USER_EXIT_ROOM/* :int */ = 1701868147;
    this.GOT_REPLY_OF_ALL_ROOMS/* :int */ = 1917612916;
    this.GOT_REPLY_OF_ALL_USERS/* :int */ = 1967944564;

    this.DOOR_LOCK/* :int */ = 1819239275;
    this.DOOR_UNLOCK/* :int */ = 1970170991;
    this.SPOT_STATE/* :int */ = 1934849121;
    this.SPOT_MOVE/* :int */ = 1668238451;
    this.PICT_MOVE/* :int */ = 1884057443;
    this.DRAW_CMD/* :int */ = 1685217655;
    // Loose Props
    this.PROP_MOVE/* :int */ = 1833988720;
    this.PROP_DELETE/* :int */ = 1682993776;
    this.PROP_NEW/* :int */ = 1850765936;

    // Assets
    this.ASSET_QUERY/* :int */ = 1900114804;

    // Status...
    this.NAV_ERROR/* :int */ = 1933931122;
    this.SERVER_DOWN/* :int */ = 1685026670;

    // Blowthru...
    this.BLOWTHRU/* :int */ = 1651273591;

    // Authentication...
    this.AUTHENTICATE/* :int */ = 0x61757468;
}


module.exports = IncomingMessageTypes;
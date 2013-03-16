var IncomingMessageTypes = {
    // ----------------------------------------------------------------------
    // From Server
    // ----------------------------------------------------------------------

    // Server Types
    "UNKNOWN_SERVER": 1886610802,
    "LITTLE_ENDIAN_SERVER": 1920559476,
    "BIG_ENDIAN_SERVER": 1953069426,

    // Login
    "ALTERNATE_LOGON_REPLY": 1919250482,

    "SERVER_VERSION": 1986359923,
    "SERVER_INFO": 1936289382,
    "USER_STATUS": 1968403553,
    "USER_LOGGED_ON_AND_MAX": 1819240224,
    "GOT_HTTP_SERVER_LOCATION": 1213486160,

    // the following four are whenever you change rooms as well as login
    "GOT_ROOM_DESCRIPTION": 1919905645,
    "GOT_ROOM_DESCRIPTION_ALT": 1934782317,
    "GOT_USER_LIST": 1919971955,
    "GOT_ROOM_LIST": 1917612916,
    "ROOM_DESCEND": 1701733490, // ???
    "USER_NEW": 1852863091,

    "PINGED": 1885957735,

    "XTALK": 0x78746c6b, // Encrypted
    "XWHISPER": 0x78776973, // Encrypted
    "TALK": 0x74616C6B, // Unencrypted
    "WHISPER": 0x77686973, // Unencrypted
    "MOVEMENT": 1967943523,
    "USER_COLOR": 1970500163,
    "USER_FACE": 1970500166,
    "USER_DESCRIPTION": 1970500164,
    "USER_PROP": 1970500176,
    "USER_RENAME": 1970500174,
    "USER_LEAVING": 1652122912, // ?
    "CONNECTION_DIED": 1685026670,
    "INCOMING_FILE": 1933994348,
    "ASSET_INCOMING": 1933669236,
    "USER_EXIT_ROOM": 1701868147,
    "GOT_REPLY_OF_ALL_ROOMS": 1917612916,
    "GOT_REPLY_OF_ALL_USERS": 1967944564,

    "DOOR_LOCK": 1819239275,
    "DOOR_UNLOCK": 1970170991,
    "SPOT_STATE": 1934849121,
    "SPOT_MOVE": 1668238451,
    "PICT_MOVE": 1884057443,
    "DRAW_CMD": 1685217655,
    // Loose Props
    "PROP_MOVE": 1833988720,
    "PROP_DELETE": 1682993776,
    "PROP_NEW": 1850765936,

    // Assets
    "ASSET_QUERY": 1900114804,

    // Status...
    "NAV_ERROR": 1933931122,
    "SERVER_DOWN": 1685026670,

    // Blowthru...
    "BLOWTHRU": 1651273591,

    // Authentication...
    "AUTHENTICATE": 0x61757468
}


module.exports = IncomingMessageTypes;
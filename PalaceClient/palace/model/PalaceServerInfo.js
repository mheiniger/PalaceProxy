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

function PalaceServerInfo() {
    return {
         name : '',
         _permissions : 0,
         _options : 0,
         _uploadCapabilities : 0,
         _downloadCapabilities : 0,
    
        // Permissions
         ALLOW_GUESTS         : 0x0001, //guests may use this server
         ALLOW_CYBORGS        : 0x0002, //clients can use cyborg.ipt scripts
         ALLOW_PAINTING       : 0x0004, //clients may issue draw commands
         ALLOW_CUSTOM_PROPS   : 0x0008, //clients may select custom props
         ALLOW_WIZARDS        : 0x0010, //wizards can use this server
         WIZARDS_MAY_KILL     : 0x0020, //wizards can kick off users
         WIZARDS_MAY_AUTHOR   : 0x0040, //wizards can create rooms
         PLAYERS_MAY_KILL     : 0x0080, //normal users can kick each other off
         CYBORGS_MAY_KILL     : 0x0100, //scripts can kick off users
         DEATH_PENALTY        : 0x0200,
         PURGE_INACTIVE_PROPS : 0x0400, //server discards unused props
         KILL_FLOODERS        : 0x0800, //users dropped if they do too much too fast
         NO_SPOOFING          : 0x1000, //command to speak as another is disabled
         MEMBER_CREATED_ROOMS : 0x2000, //users can create rooms

         allowGuests            : false,
         allowCyborgs           : false,
         allowPainting          : false,
         allowCustomProps       : false,
         allowWizards           : false,
         wizardsMayKill         : false,
         wizardsMayAuthor       : false,
         playersMayKill         : false,
         cyborgsMayKill         : false,
         deathPenalty           : false,
         purgeInactiveProps     : false,
         killFlooders           : false,
         noSpoofing             : false,
         memberCreatedRooms     : false,


        //  Options
         SAVE_SESSION_KEYS  : 0x00000001, // server logs regcodes of users (obsolete)
         PASSWORD_SECURITY  : 0x00000002, // you need a password to use this server
         CHAT_LOG           : 0x00000004, // server logs all chat
         NO_WHISPER         : 0x00000008, // whisper command disabled
         ALLOW_DEMO_MEMBERS : 0x00000010, // Obsolete
         AUTHENTICATE       : 0x00000020, // unknown
         POUND_PROTECT      : 0x00000040, // server employs heuristics to evade hackers
         SORT_OPTIONS       : 0x00000080, // unknown
         AUTH_TRACK_LOGOFF  : 0x00000100, // server logs logoffs
         JAVA_SECURE        : 0x00000200, // server supports Java client's auth. scheme

         saveSessionKeys    : false,
         passwordSecurity   : false,
         chatLog            : false,
         noWhisper          : false,
         allowDemoMembers   : false,
         authenticate       : false,
         poundProtect       : false,
         sortOptions        : false,
         authTrackLogoff    : false,
         javaSecure         : false,


        // Upload Capabilities
         ULCAPS_ASSETS_PALACE : 0x00000001,
         ULCAPS_ASSETS_FTP    : 0x00000002,
         ULCAPS_ASSETS_HTTP   : 0x00000004,
         ULCAPS_ASSETS_OTHER  : 0x00000008,
         ULCAPS_FILES_PALACE  : 0x00000010,
         ULCAPS_FILES_FTP     : 0x00000020,
         ULCAPS_FILES_HTTP    : 0x00000040,
         ULCAPS_FILES_OTHER   : 0x00000080,
         ULCAPS_EXTEND_PKT    : 0x00000100,


        // Download Capabilities
         DLCAPS_ASSETS_PALACE    : 0x00000001,
         DLCAPS_ASSETS_FTP       : 0x00000002,
         DLCAPS_ASSETS_HTTP      : 0x00000004,
         DLCAPS_ASSETS_OTHER     : 0x00000008,
         DLCAPS_FILES_PALACE     : 0x00000010,
         DLCAPS_FILES_FTP        : 0x00000020,
         DLCAPS_FILES_HTTP       : 0x00000040,
         DLCAPS_FILES_OTHER      : 0x00000080,
         DLCAPS_FILES_HTTPSERVER : 0x00000100,
         DLCAPS_EXTEND_PKT       : 0x00000200,


        "set Permissions": function (input) {
            this._permissions       = input;
            this.allowGuests        = Boolean(input & this.ALLOW_GUESTS);
            this.allowCyborgs       = Boolean(input & this.ALLOW_CYBORGS);
            this.allowPainting      = Boolean(input & this.ALLOW_PAINTING);
            this.allowCustomProps   = Boolean(input & this.ALLOW_CUSTOM_PROPS);
            this.allowWizards       = Boolean(input & this.ALLOW_WIZARDS);
            this.wizardsMayKill     = Boolean(input & this.WIZARDS_MAY_KILL);
            this.wizardsMayAuthor   = Boolean(input & this.WIZARDS_MAY_AUTHOR);
            this.playersMayKill     = Boolean(input & this.PLAYERS_MAY_KILL);
            this.cyborgsMayKill     = Boolean(input & this.CYBORGS_MAY_KILL);
            this.deathPenalty       = Boolean(input & this.DEATH_PENALTY);
            this.purgeInactiveProps = Boolean(input & this.PURGE_INACTIVE_PROPS);
            this.killFlooders       = Boolean(input & this.KILL_FLOODERS);
            this.noSpoofing         = Boolean(input & this.NO_SPOOFING);
            this.memberCreatedRooms = Boolean(input & this.MEMBER_CREATED_ROOMS)
        },

        "get Permissions": function () {
            return this._permissions;
        },

        "set options" : function(input) {
            this._options = input;
            this.saveSessionKeys    = Boolean(input & this.SAVE_SESSION_KEYS);
            this.passwordSecurity   = Boolean(input & this.PASSWORD_SECURITY);
            this.chatLog            = Boolean(input & this.CHAT_LOG);
            this.noWhisper          = Boolean(input & this.NO_WHISPER);
            this.allowDemoMembers   = Boolean(input & this.ALLOW_DEMO_MEMBERS);
            this.authenticate       = Boolean(input & this.AUTHENTICATE);
            this.poundProtect       = Boolean(input & this.POUND_PROTECT);
            this.sortOptions        = Boolean(input & this.SORT_OPTIONS);
            this.authTrackLogoff    = Boolean(input & this.AUTH_TRACK_LOGOFF);
            this.javaSecure         = Boolean(input & this.JAVA_SECURE)
        },

        "get options": function () {
            return this._options;
        },

        "set uploadCapabilities": function (input) {
            this._uploadCapabilities = input;
        },

        "get uploadCapabilities": function () {
            return this._uploadCapabilities;
        },

        "set downloadCapabilities": function (input) {
            this._downloadCapabilities = input;
        },

        "get downloadCapabilities": function () {
            return this._downloadCapabilities;
        }
    }
};

module.exports = PalaceServerInfo;
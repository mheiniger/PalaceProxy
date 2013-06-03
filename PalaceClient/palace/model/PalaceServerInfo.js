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

//package net.codecomposer.palace.model
//{
//	import flash.system.Capabilities;

/* \[Bindable\] */
function PalaceServerInfo()
{
    this.constants = {};
    this.name/* :String */;
    var _permissions = this._permissions/* :int */ = 0;
    var _options = this._options/* :uint */ = 0;
    var _uploadCapabilities = this._uploadCapabilities/* :uint */ = 0;
    var _downloadCapabilities = this._downloadCapabilities/* :uint */ = 0;

    // Permissions
    var ALLOW_GUESTS = this.ALLOW_GUESTS = this.constants.ALLOW_GUESTS/* :int */         = 0x0001; //guests may use this server
    var ALLOW_CYBORGS = this.ALLOW_CYBORGS = this.constants.ALLOW_CYBORGS/* :int */        = 0x0002; //clients can use cyborg.ipt scripts
    var ALLOW_PAINTING = this.ALLOW_PAINTING = this.constants.ALLOW_PAINTING/* :int */       = 0x0004; //clients may issue draw commands
    var ALLOW_CUSTOM_PROPS = this.ALLOW_CUSTOM_PROPS = this.constants.ALLOW_CUSTOM_PROPS/* :int */   = 0x0008; //clients may select custom props
    var ALLOW_WIZARDS = this.ALLOW_WIZARDS = this.constants.ALLOW_WIZARDS/* :int */        = 0x0010; //wizards can use this server
    var WIZARDS_MAY_KILL = this.WIZARDS_MAY_KILL = this.constants.WIZARDS_MAY_KILL/* :int */     = 0x0020; //wizards can kick off users
    var WIZARDS_MAY_AUTHOR = this.WIZARDS_MAY_AUTHOR = this.constants.WIZARDS_MAY_AUTHOR/* :int */   = 0x0040; //wizards can create rooms
    var PLAYERS_MAY_KILL = this.PLAYERS_MAY_KILL = this.constants.PLAYERS_MAY_KILL/* :int */     = 0x0080; //normal users can kick each other off
    var CYBORGS_MAY_KILL = this.CYBORGS_MAY_KILL = this.constants.CYBORGS_MAY_KILL/* :int */     = 0x0100; //scripts can kick off users
    var DEATH_PENALTY = this.DEATH_PENALTY = this.constants.DEATH_PENALTY/* :int */        = 0x0200;
    var PURGE_INACTIVE_PROPS = this.PURGE_INACTIVE_PROPS = this.constants.PURGE_INACTIVE_PROPS/* :int */ = 0x0400; //server discards unused props
    var KILL_FLOODERS = this.KILL_FLOODERS = this.constants.KILL_FLOODERS/* :int */        = 0x0800; //users dropped if they do too much too fast
    var NO_SPOOFING = this.NO_SPOOFING = this.constants.NO_SPOOFING/* :int */          = 0x1000; //command to speak as another is disabled
    var MEMBER_CREATED_ROOMS = this.MEMBER_CREATED_ROOMS = this.constants.MEMBER_CREATED_ROOMS/* :int */ = 0x2000; //users can create rooms

    var allowGuests = this.allowGuests/* :Boolean */ = false;
    var allowCyborgs = this.allowCyborgs/* :Boolean */ = false;
    var allowPainting = this.allowPainting/* :Boolean */ = false;
    var allowCustomProps = this.allowCustomProps/* :Boolean */ = false;
    var allowWizards = this.allowWizards/* :Boolean */ = false;
    var wizardsMayKill = this.wizardsMayKill/* :Boolean */ = false;
    var wizardsMayAuthor = this.wizardsMayAuthor/* :Boolean */ = false;
    var playersMayKill = this.playersMayKill/* :Boolean */ = false;
    var cyborgsMayKill = this.cyborgsMayKill/* :Boolean */ = false;
    var deathPenalty = this.deathPenalty/* :Boolean */ = false;
    var purgeInactiveProps = this.purgeInactiveProps/* :Boolean */ = false;
    var killFlooders = this.killFlooders/* :Boolean */ = false;
    var noSpoofing = this.noSpoofing/* :Boolean */ = false;
    var memberCreatedRooms = this.memberCreatedRooms/* :Boolean */ = false;


    //  Options
    var SAVE_SESSION_KEYS = this.SAVE_SESSION_KEYS = this.constants.SAVE_SESSION_KEYS/* :uint */  = 0x00000001; // server logs regcodes of users (obsolete)
    var PASSWORD_SECURITY = this.PASSWORD_SECURITY = this.constants.PASSWORD_SECURITY/* :uint */  = 0x00000002; // you need a password to use this server
    var CHAT_LOG = this.CHAT_LOG = this.constants.CHAT_LOG/* :uint */           = 0x00000004; // server logs all chat
    var NO_WHISPER = this.NO_WHISPER = this.constants.NO_WHISPER/* :uint */         = 0x00000008; // whisper command disabled
    var ALLOW_DEMO_MEMBERS = this.ALLOW_DEMO_MEMBERS = this.constants.ALLOW_DEMO_MEMBERS/* :uint */ = 0x00000010; // Obsolete
    var AUTHENTICATE = this.AUTHENTICATE = this.constants.AUTHENTICATE/* :uint */       = 0x00000020; // unknown
    var POUND_PROTECT = this.POUND_PROTECT = this.constants.POUND_PROTECT/* :uint */      = 0x00000040; // server employs heuristics to evade hackers
    var SORT_OPTIONS = this.SORT_OPTIONS = this.constants.SORT_OPTIONS/* :uint */       = 0x00000080; // unknown
    var AUTH_TRACK_LOGOFF = this.AUTH_TRACK_LOGOFF = this.constants.AUTH_TRACK_LOGOFF/* :uint */  = 0x00000100; // server logs logoffs
    var JAVA_SECURE = this.JAVA_SECURE = this.constants.JAVA_SECURE/* :uint */        = 0x00000200; // server supports Java client's auth. scheme

    var saveSessionKeys = this.saveSessionKeys/* :Boolean */ = false;
    var passwordSecurity = this.passwordSecurity/* :Boolean */ = false;
    var chatLog = this.chatLog/* :Boolean */ = false;
    var noWhisper = this.noWhisper/* :Boolean */ = false;
    var allowDemoMembers = this.allowDemoMembers/* :Boolean */ = false;
    var authenticate = this.authenticate/* :Boolean */ = false;
    var poundProtect = this.poundProtect/* :Boolean */ = false;
    var sortOptions = this.sortOptions/* :Boolean */ = false;
    var authTrackLogoff = this.authTrackLogoff/* :Boolean */ = false;
    var javaSecure = this.javaSecure/* :Boolean */ = false;


    // Upload Capabilities
    var ULCAPS_ASSETS_PALACE = this.ULCAPS_ASSETS_PALACE = this.constants.ULCAPS_ASSETS_PALACE/* :uint */ = 0x00000001;
    var ULCAPS_ASSETS_FTP = this.ULCAPS_ASSETS_FTP = this.constants.ULCAPS_ASSETS_FTP/* :uint */    = 0x00000002;
    var ULCAPS_ASSETS_HTTP = this.ULCAPS_ASSETS_HTTP = this.constants.ULCAPS_ASSETS_HTTP/* :uint */   = 0x00000004;
    var ULCAPS_ASSETS_OTHER = this.ULCAPS_ASSETS_OTHER = this.constants.ULCAPS_ASSETS_OTHER/* :uint */  = 0x00000008;
    var ULCAPS_FILES_PALACE = this.ULCAPS_FILES_PALACE = this.constants.ULCAPS_FILES_PALACE/* :uint */  = 0x00000010;
    var ULCAPS_FILES_FTP = this.ULCAPS_FILES_FTP = this.constants.ULCAPS_FILES_FTP/* :uint */     = 0x00000020;
    var ULCAPS_FILES_HTTP = this.ULCAPS_FILES_HTTP = this.constants.ULCAPS_FILES_HTTP/* :uint */    = 0x00000040;
    var ULCAPS_FILES_OTHER = this.ULCAPS_FILES_OTHER = this.constants.ULCAPS_FILES_OTHER/* :uint */   = 0x00000080;
    var ULCAPS_EXTEND_PKT = this.ULCAPS_EXTEND_PKT = this.constants.ULCAPS_EXTEND_PKT/* :uint */    = 0x00000100;


    // Download Capabilities
    var DLCAPS_ASSETS_PALACE = this.DLCAPS_ASSETS_PALACE = this.constants.DLCAPS_ASSETS_PALACE/* :uint */    = 0x00000001;
    var DLCAPS_ASSETS_FTP = this.DLCAPS_ASSETS_FTP = this.constants.DLCAPS_ASSETS_FTP/* :uint */       = 0x00000002;
    var DLCAPS_ASSETS_HTTP = this.DLCAPS_ASSETS_HTTP = this.constants.DLCAPS_ASSETS_HTTP/* :uint */      = 0x00000004;
    var DLCAPS_ASSETS_OTHER = this.DLCAPS_ASSETS_OTHER = this.constants.DLCAPS_ASSETS_OTHER/* :uint */     = 0x00000008;
    var DLCAPS_FILES_PALACE = this.DLCAPS_FILES_PALACE = this.constants.DLCAPS_FILES_PALACE/* :uint */     = 0x00000010;
    var DLCAPS_FILES_FTP = this.DLCAPS_FILES_FTP = this.constants.DLCAPS_FILES_FTP/* :uint */        = 0x00000020;
    var DLCAPS_FILES_HTTP = this.DLCAPS_FILES_HTTP = this.constants.DLCAPS_FILES_HTTP/* :uint */       = 0x00000040;
    var DLCAPS_FILES_OTHER = this.DLCAPS_FILES_OTHER = this.constants.DLCAPS_FILES_OTHER/* :uint */      = 0x00000080;
    var DLCAPS_FILES_HTTPSERVER = this.DLCAPS_FILES_HTTPSERVER = this.constants.DLCAPS_FILES_HTTPSERVER/* :uint */ = 0x00000100;
    var DLCAPS_EXTEND_PKT = this.DLCAPS_EXTEND_PKT = this.constants.DLCAPS_EXTEND_PKT/* :uint */       = 0x00000200;


    var set_permissions = this.set_permissions = function(input/* :int */)/* :void */ {
        _permissions = input;
        allowGuests        = Boolean(input & ALLOW_GUESTS);
        allowCyborgs       = Boolean(input & ALLOW_CYBORGS);
        allowPainting      = Boolean(input & ALLOW_PAINTING);
        allowCustomProps   = Boolean(input & ALLOW_CUSTOM_PROPS);
        allowWizards       = Boolean(input & ALLOW_WIZARDS);
        wizardsMayKill     = Boolean(input & WIZARDS_MAY_KILL);
        wizardsMayAuthor   = Boolean(input & WIZARDS_MAY_AUTHOR);
        playersMayKill     = Boolean(input & PLAYERS_MAY_KILL);
        cyborgsMayKill     = Boolean(input & CYBORGS_MAY_KILL);
        deathPenalty       = Boolean(input & DEATH_PENALTY);
        purgeInactiveProps = Boolean(input & PURGE_INACTIVE_PROPS);
        killFlooders       = Boolean(input & KILL_FLOODERS);
        noSpoofing         = Boolean(input & NO_SPOOFING);
        memberCreatedRooms = Boolean(input & MEMBER_CREATED_ROOMS);
    }

    var get_permissions = this.get_permissions = function()/* :int */ {
        return _permissions;
    }

    var set_options = this.set_options = function(input/* :uint */)/* :void */ {
        _options = input;
        saveSessionKeys    = Boolean(input & SAVE_SESSION_KEYS);
        passwordSecurity   = Boolean(input & PASSWORD_SECURITY);
        chatLog            = Boolean(input & CHAT_LOG);
        noWhisper          = Boolean(input & NO_WHISPER);
        allowDemoMembers   = Boolean(input & ALLOW_DEMO_MEMBERS);
        authenticate       = Boolean(input & AUTHENTICATE);
        poundProtect       = Boolean(input & POUND_PROTECT);
        sortOptions        = Boolean(input & SORT_OPTIONS);
        authTrackLogoff    = Boolean(input & AUTH_TRACK_LOGOFF);
        javaSecure         = Boolean(input & JAVA_SECURE);
    }

    var get_options = this.get_options = function()/* :uint */ {
        return _options;
    }

    var set_uploadCapabilities = this.set_uploadCapabilities = function(input/* :uint */)/* :void */ {
        _uploadCapabilities = input;
    }

    var get_uploadCapabilities = this.get_uploadCapabilities = function()/* :uint */ {
        return _uploadCapabilities;
    }

    var set_downloadCapabilities = this.set_downloadCapabilities = function(input/* :uint */)/* :void */ {
        _downloadCapabilities = input;
    }

    var get_downloadCapabilities = this.get_downloadCapabilities = function()/* :uint */ {
        return _downloadCapabilities;
    }
}
//}

module.exports = PalaceServerInfo;
var PalaceServerInfoVar = new PalaceServerInfo();
for (var name in PalaceServerInfoVar.constants) {
    module.exports[name] = PalaceServerInfoVar.constants[name];
}
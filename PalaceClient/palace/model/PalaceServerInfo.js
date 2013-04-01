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
    this.name/* :String */;
    this._permissions/* :int */ = 0;
    this._options/* :uint */ = 0;
    this._uploadCapabilities/* :uint */ = 0;
    this._downloadCapabilities/* :uint */ = 0;

// Permissions
    this.ALLOW_GUESTS/* :int */ = 0x0001; //guests may use this server
    this.ALLOW_CYBORGS/* :int */ = 0x0002; //clients can use cyborg.ipt scripts
    this.ALLOW_PAINTING/* :int */ = 0x0004; //clients may issue draw commands
    this.ALLOW_CUSTOM_PROPS/* :int */ = 0x0008; //clients may select custom props
    this.ALLOW_WIZARDS/* :int */ = 0x0010; //wizards can use this server
    this.WIZARDS_MAY_KILL/* :int */ = 0x0020; //wizards can kick off users
    this.WIZARDS_MAY_AUTHOR/* :int */ = 0x0040; //wizards can create rooms
    this.PLAYERS_MAY_KILL/* :int */ = 0x0080; //normal users can kick each other off
    this.CYBORGS_MAY_KILL/* :int */ = 0x0100; //scripts can kick off users
    this.DEATH_PENALTY/* :int */ = 0x0200;
    this.PURGE_INACTIVE_PROPS/* :int */ = 0x0400; //server discards unused props
    this.KILL_FLOODERS/* :int */ = 0x0800; //users dropped if they do too much too fast
    this.NO_SPOOFING/* :int */ = 0x1000; //command to speak as another is disabled
    this.MEMBER_CREATED_ROOMS/* :int */ = 0x2000; //users can create rooms

    this.allowGuests = false;
    this.allowCyborgs = false;
    this.allowPainting = false;
    this.allowCustomProps = false;
    this.allowWizards = false;
    this.wizardsMayKill = false;
    this.wizardsMayAuthor = false;
    this.playersMayKill = false;
    this.cyborgsMayKill = false;
    this.deathPenalty = false;
    this.purgeInactiveProps = false;
    this.killFlooders = false;
    this.noSpoofing = false;
    this.memberCreatedRooms = false;

//  Options
    this.SAVE_SESSION_KEYS/* :uint */ = 0x00000001; // server logs regcodes of users (obsolete)
    this.PASSWORD_SECURITY/* :uint */ = 0x00000002; // you need a password to use this server
    this.CHAT_LOG/* :uint */ = 0x00000004; // server logs all chat
    this.NO_WHISPER/* :uint */ = 0x00000008; // whisper command disabled
    this.ALLOW_DEMO_MEMBERS/* :uint */ = 0x00000010; // Obsolete
    this.AUTHENTICATE/* :uint */ = 0x00000020; // unknown
    this.POUND_PROTECT/* :uint */ = 0x00000040; // server employs heuristics to evade hackers
    this.SORT_OPTIONS/* :uint */ = 0x00000080; // unknown
    this.AUTH_TRACK_LOGOFF/* :uint */ = 0x00000100; // server logs logoffs
    this.JAVA_SECURE/* :uint */ = 0x00000200; // server supports Java client's auth. scheme

    this.saveSessionKeys = false;
    this.passwordSecurity = false;
    this.chatLog = false;
    this.noWhisper = false;
    this.allowDemoMembers = false;
    this.authenticate = false;
    this.poundProtect = false;
    this.sortOptions = false;
    this.authTrackLogoff = false;
    this.javaSecure = false;


// Upload Capabilities
    this.ULCAPS_ASSETS_PALACE/* :uint */ = 0x00000001;
    this.ULCAPS_ASSETS_FTP/* :uint */ = 0x00000002;
    this.ULCAPS_ASSETS_HTTP/* :uint */ = 0x00000004;
    this.ULCAPS_ASSETS_OTHER/* :uint */ = 0x00000008;
    this.ULCAPS_FILES_PALACE/* :uint */ = 0x00000010;
    this.ULCAPS_FILES_FTP/* :uint */ = 0x00000020;
    this.ULCAPS_FILES_HTTP/* :uint */ = 0x00000040;
    this.ULCAPS_FILES_OTHER/* :uint */ = 0x00000080;
    this.ULCAPS_EXTEND_PKT/* :uint */ = 0x00000100;


// Download Capabilities
    this.DLCAPS_ASSETS_PALACE/* :uint */ = 0x00000001;
    this.DLCAPS_ASSETS_FTP/* :uint */ = 0x00000002;
    this.DLCAPS_ASSETS_HTTP/* :uint */ = 0x00000004;
    this.DLCAPS_ASSETS_OTHER/* :uint */ = 0x00000008;
    this.DLCAPS_FILES_PALACE/* :uint */ = 0x00000010;
    this.DLCAPS_FILES_FTP/* :uint */ = 0x00000020;
    this.DLCAPS_FILES_HTTP/* :uint */ = 0x00000040;
    this.DLCAPS_FILES_OTHER/* :uint */ = 0x00000080;
    this.DLCAPS_FILES_HTTPSERVER/* :uint */ = 0x00000100;
    this.DLCAPS_EXTEND_PKT/* :uint */ = 0x00000200;


    /* public */
    this['set permissions'] = function (input/* :int */)
        /* :void */ {
        this._permissions = input;
        this.allowGuests = Boolean(input & this.ALLOW_GUESTS);
        this.allowCyborgs = Boolean(input & this.ALLOW_CYBORGS);
        this.allowPainting = Boolean(input & this.ALLOW_PAINTING);
        this.allowCustomProps = Boolean(input & this.ALLOW_CUSTOM_PROPS);
        this.allowWizards = Boolean(input & this.ALLOW_WIZARDS);
        this.wizardsMayKill = Boolean(input & this.WIZARDS_MAY_KILL);
        this.wizardsMayAuthor = Boolean(input & this.WIZARDS_MAY_AUTHOR);
        this.playersMayKill = Boolean(input & this.PLAYERS_MAY_KILL);
        this.cyborgsMayKill = Boolean(input & this.CYBORGS_MAY_KILL);
        this.deathPenalty = Boolean(input & this.DEATH_PENALTY);
        this.purgeInactiveProps = Boolean(input & this.PURGE_INACTIVE_PROPS);
        this.killFlooders = Boolean(input & this.KILL_FLOODERS);
        this.noSpoofing = Boolean(input & this.NO_SPOOFING);
        this.memberCreatedRooms = Boolean(input & this.MEMBER_CREATED_ROOMS);
    }

    /* public */
    this['get permissions'] = function ()/* :int */ {
        return _permissions;
    }

    /* public */
    this['set options'] = function (input/* :uint */)/* :void */ {
        this._options = input;
        this.saveSessionKeys = Boolean(input & this.SAVE_SESSION_KEYS);
        this.passwordSecurity = Boolean(input & this.PASSWORD_SECURITY);
        this.chatLog = Boolean(input & this.CHAT_LOG);
        this.noWhisper = Boolean(input & this.NO_WHISPER);
        this.allowDemoMembers = Boolean(input & this.ALLOW_DEMO_MEMBERS);
        this.authenticate = Boolean(input & this.AUTHENTICATE);
        this.poundProtect = Boolean(input & this.POUND_PROTECT);
        this.sortOptions = Boolean(input & this.SORT_OPTIONS);
        this.authTrackLogoff = Boolean(input & this.AUTH_TRACK_LOGOFF);
        this.javaSecure = Boolean(input & this.JAVA_SECURE);
    }

    /* public */
    this['get options'] = function ()/* :uint */ {
        return this._options;
    }

    /* public */
    this['set uploadCapabilities'] = function (input/* :uint */)/* :void */ {
        this._uploadCapabilities = input;
    }

    /* public */
    this['get uploadCapabilities'] = function ()/* :uint */ {
        return this._uploadCapabilities;
    }

    /* public */
    this['set downloadCapabilities'] = function (input/* :uint */)/* :void */ {
        this._downloadCapabilities = input;
    }

    /* public */
    this['get downloadCapabilities'] = function ()/* :uint */ {
        return this._downloadCapabilities;
    }
}

module.exports = PalaceServerInfo;
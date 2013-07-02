/*
 This file is part of OpenPalace.

 OpenPalace is free software: you can redistribute it and/or modify
 it under the terms of the GNU General public license as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 OpenPalace is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General public License for more details.

 You should have received a copy of the GNU General public License
 along with OpenPalace.  If not, see <http://www.gnu.org/licenses/>.
 */

var util = require('util');
var Event = require("../../adapter/events/Event");
var EventDispatcher = require("../../adapter/events/EventDispatcher");
//import flash.utils.Dictionary;
var Timer = require("../../adapter/utils/Timer");
var PalaceImageOverlay = require("./PalaceImageOverlay");
var PalaceLooseProp = require("./PalaceLooseProp");

var ArrayCollection = require("../../adapter/collections/ArrayCollection");
var PalaceRoomEvent = require("../../palace/event/PalaceRoomEvent");
var ChatEvent = require("../../palace/event/ChatEvent");
var PropEvent = require("../../palace/event/PropEvent");
var PalaceUtil = require("../../palace/util/PalaceUtil");
//import net.codecomposer.palace.view.PalaceRoomView;
var PalaceUser = require("../../palace/model/PalaceUser");


util.inherits(PalaceCurrentRoom, EventDispatcher);
/* extends EventDispatcher */
function PalaceCurrentRoom() {
    PalaceCurrentRoom.super_.call(this);
    var that = this;

    this.id/* :int */ = 0;
    this.name/* :String */ = "Not Connected";
    this.backgroundFile/* :String */ = '';
    this.users/* :Array Collection */ = new ArrayCollection();
    this.usersHash/* :Object */ = {};
    this.roomFlags/* :int */ = 0;
    this.images/* :Object */ = {};
    this.spotImages/* :Object */ = {};
    this.hotSpots/* :Array Collection */ = new ArrayCollection();
    this.hotSpotsAboveNothing/* :Array Collection */ = new ArrayCollection();
    this.hotSpotsAboveAvatars/* :Array Collection */ = new ArrayCollection();
    this.hotSpotsAboveNametags/* :Array Collection */ = new ArrayCollection();
    this.hotSpotsAboveEverything/* :Array Collection */ = new ArrayCollection();
    this.hotSpotsById/* :Object */ = {};
    this.looseProps/* :Array Collection */ = new ArrayCollection();
    this.drawFrontCommands/* :Array Collection */ = new ArrayCollection();
    this.drawBackCommands/* :Array Collection */ = new ArrayCollection();
    this.drawLayerHistory/* :Vector.<uint> */ = [];
    var _selectedUser = 0;
    this.selfUserId/* :int */ = -1;
    this.roomView/* :PalaceRoom View */ = null;
    this.dimLevel/* :Number */ = 1;
    this.showAvatars/* :Boolean */ = true;

    this.chatLog/* :String */ = "";

    this.lastMessage/* :String */ = "";
    this.lastMessageCount/* :int */ = 0;
    this.lastMessageReceived/* :Number */ = 0;
    this.lastMessageTimer/* :Timer */ = new Timer(250, 1);

    this.statusMessageString/* :String */ = "";

    var statusDisappearTimer/* :Timer */ = new Timer(30000, 1);

    function dispatchEvent(object) {
        trace("PalaceCurrentRoom dispatches event: " + object.type);
        that.dispatchEvent(object.type, object);
    }


    this.PalaceCurrentRoomConstructor = function () {
        // todo: implement
        //lastMessageTimer.addEventListener(TimerEvent.TIMER, handleLastMessageTimer);
        //statusDisappearTimer.addEventListener(TimerEvent.TIMER, handleStatusDisappearTimer);
    }()

    this.set_selectedUser = function (newValue/* :PalaceUser */)/* :void */ {
        if (_selectedUser !== newValue) {
            _selectedUser = newValue;
            dispatchEvent(new Event("selectedUserChanged"));
        }
    };

    this.get_selectedUser = function ()/* :PalaceUser */ {
        return _selectedUser;
    };

    /* private */
    function handleLastMessageTimer(event/* :Timer Event */)/* :void */ {
        that.logMessage("(Last message received " + that.lastMessageCount.toString() + ((that.lastMessageCount == 1) ? " time.)" : " times.)"));
        that.lastMessage = "";
        that.lastMessageCount = 0;
        that.lastMessageReceived = 0;
    }

    /* private */
    function shouldDisplayMessage(message/* :String */)/* :Boolean */ {
        var retValue/* :Boolean */ = true;
        if (that.lastMessage == message && that.lastMessageReceived > (new Date()).valueOf() - 250) {
            that.lastMessageTimer.stop();
            that.lastMessageTimer.reset();
            that.lastMessageTimer.start();
            that.lastMessageCount++;
            retValue = false;
        }
        else {
            that.lastMessageCount = 1;
        }
        that.lastMessage = message;
        that.lastMessageReceived = (new Date()).valueOf();
        return retValue;
    }

    this.getSpotImageById = function (imageId/* :int */)/* :PalaceImageOverlay */ {
        return/* :PalaceImageOverlay */  PalaceImageOverlay(that.spotImages[imageId]);
    };

    this.addSpotImage = function (imageOverlay/* :PalaceImageOverlay */)/* :void */ {
        that.spotImages[imageOverlay.id] = imageOverlay;
    };

    this.clearSpotImages = function ()/* :void */ {
        that.spotImages = {}; //new Dictionary();
    };

    this.getHotspotById = function (spotId/* :int */)/* :PalaceHotspot */ {
        return that.hotSpotsById[spotId];
    };

    this.dimRoom = function (level/* :int */)/* :void */ {
        level = Math.max(0, level);
        level = Math.min(100, level);
        that.dimLevel = level / 100;
    };

    this.addLooseProp = function (id/* :int */, crc/* :uint */, x/* :int */, y/* :int */, addToFront/* :Boolean */)/* :void */ {
        addToFront = addToFront || false;
        var prop/* :PalaceLooseProp */ = new PalaceLooseProp();
        prop.x = x;
        prop.y = y;
        prop.id = id;
        prop.crc = crc;
        prop.loadProp();
        if (addToFront) {
            that.looseProps.addItem(prop);
        }
        else {
            that.looseProps.addItemAt(prop, 0);
        }
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_ADDED);
        event.looseProp = prop;
        event.addToFront = addToFront;
        dispatchEvent(event);
    };

    this.removeLooseProp = function (index/* :int */)/* :void */ {
        if (index == -1) {
            clearLooseProps();
        }
        else {
            that.looseProps.removeItemAt(index);
            var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_REMOVED);
            event.propIndex = index;
            dispatchEvent(event);
        }
    };

    this.moveLooseProp = function (index/* :int */, x/* :int */, y/* :int */)/* :void */ {
//			trace("Moving prop index " + index);
        var prop/* :PalaceLooseProp */ = PalaceLooseProp(that.looseProps.getItemAt(index));
        prop.x = x;
        prop.y = y;
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_MOVED);
        event.looseProp = prop;
        dispatchEvent(event);
    };

    var clearLooseProps = this.clearLooseProps = function ()/* :void */ {
        that.looseProps.removeAll();
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROPS_CLEARED);
        dispatchEvent(event);
    };

    this.getLoosePropByIndex = function (index/* :int */)/* :PalaceLooseProp */ {
        return PalaceLooseProp(that.looseProps.getItemAt(index));
    };

    this.addUser = function (user/* :PalaceUser */)/* :void */ {
        that.usersHash[user.id] = user;
        that.users.addItem(user);

        user.on('faceChanged', function () {
            var event = new Event("faceChanged");
            event.user = user;
            dispatchEvent(event);
        });

        user.on(PropEvent.PROP_LOADED, function (data) {
            console.log('user loggs  proploaded');
            var event = new PropEvent(PropEvent.PROP_LOADED, data);
            event.user = user;
            dispatchEvent(event);
        });

        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_ENTERED, user);
        dispatchEvent(event);
    };

    this.getUserById = function (id/* :int */)/* :PalaceUser */ {
        return that.usersHash[id];
    };

    this.getUserByName = function (name/* :String */)/* :PalaceUser */ {
        for (var user/* :PalaceUser */ in that.users) {
            if (user.name == name) {
                return user;
            }
        }
        return null;
    };

    this.getUserByIndex = function (userIndex/* :int */)/* :PalaceUser */ {
        return that.users.getItemAt(userIndex);
    };

    this.getSelfUser = function ()/* :PalaceUser */ {
        return that.getUserById(that.selfUserId);
    };

    this.removeUser = function (user/* :PalaceUser */)/* :void */ {
        that.removeUserById(user.id);
    };

    this.removeUserById = function (id/* :int */)/* :void */ {
        var user/* :PalaceUser */ = that.getUserById(id);
        var index/* :int */ = that.users.getItemIndex(user);
        if (index != -1) {
            that.users.removeItemAt(that.users.getItemIndex(user));
        }
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_LEFT, user);
        dispatchEvent(event);
    };

    this.removeAllUsers = function ()/* :void */ {
        that.usersHash = {};
        that.users.removeAll();
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.ROOM_CLEARED);
        dispatchEvent(event);
    };

    this.chat = function (userId/* :int */, message/* :String */, logMessage/* :String  = null*/)/* :void */ {
        logMessage = logMessage || null;
        var user/* :PalaceUser */ = that.getUserById(userId);

        if (logMessage == null) {
            logMessage = message;
        }
        if (logMessage.length > 0) {
            recordChat("<b>", PalaceUtil.htmlEscape(user.name), ":</b> ", PalaceUtil.htmlEscape(logMessage), "\n");
            dispatchEvent(new Event('chatLogUpdated'));
        }
        if (shouldDisplayMessage(message) && message.length > 0) {
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.CHAT, message, user);
            dispatchEvent(event);
        }
    };

    var whisper = this.whisper = function (userId/* :int */, message/* :String */, logMessage/* :String */)/* :void */ {
        logMessage = logMessage || null;
        var user/* :PalaceUser */ = that.getUserById(userId);
        if (logMessage == null) {
            logMessage = message;
        }
        if (logMessage.length > 0) {
            recordChat("<em><b>", PalaceUtil.htmlEscape(user.name), " (whisper):</b> ", PalaceUtil.htmlEscape(logMessage), "</em>\n");
            dispatchEvent(new Event('chatLogUpdated'));
        }
        if (shouldDisplayMessage(message) && message.length > 0) {
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.WHISPER, message, user);
            dispatchEvent(event);
        }
    };

    this.localMessage = function (message/* :String */)/* :void */ {
        that.roomMessage(message);
    };

    this.roomMessage = function (message/* :String */)/* :void */ {
        if (shouldDisplayMessage(message) && message.length > 0) {
            recordChat("<b>*** " + PalaceUtil.htmlEscape(message), "</b>\n");
            dispatchEvent(new Event('chatLogUpdated'));
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.ROOM_MESSAGE, message);
            dispatchEvent(event);
        }
    };

    function handleStatusDisappearTimer(event/* :Timer Event */)/* :void */ {
        clearStatusMessage();
    }

    var clearStatusMessage = this.clearStatusMessage = function ()/* :void */ {
        that.statusMessageString = "";
    };

    this.statusMessage = function (message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        that.statusMessageString = message;
        statusDisappearTimer.reset();
        statusDisappearTimer.start();
        dispatchEvent(new Event('chatLogUpdated'));
    };

    this.logMessage = function (message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        dispatchEvent(new Event('chatLogUpdated'));
    };

    this.logScript = function (message/* :String */)/* :void */ {
        recordChat("<font face=\"Courier New\">" + PalaceUtil.htmlEscape(message) + "</font>\n")
        dispatchEvent(new Event('chatLogUpdated'));
    };

    this.roomWhisper = function (message/* :String */)/* :void */ {
        if (shouldDisplayMessage(message) && message.length > 0) {
            recordChat("<b><i>*** " + PalaceUtil.htmlEscape(message), "</i></b>\n");
            dispatchEvent(new Event('chatLogUpdated'));
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.ROOM_MESSAGE, message);
            dispatchEvent(event);
        }
    };

    /* private */
    function recordChat()/* :void */ {
        var temp/* :String */ = "";
        if (that.chatLog.length > 2) {
            temp = that.chatLog.substr(0, that.chatLog.length - 1);
        }
        for (var i/* :int */ = 0; i < arguments.length; i++) {
            temp += arguments[i];
        }
        that.chatLog = temp + "\n";
    }

    this.moveUser = function (userId/* :int */, x/* :int */, y/* :int */)/* :void */ {
        var user/* :PalaceUser */ = that.getUserById(userId);
        user.x = x;
        user.y = y;
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_MOVED, user);
        dispatchEvent(event);
//			trace("User " + userId + " moved to " + x + "," + y);

    };

    function trace(text) {
        console.log(text);
    }
}

module.exports = PalaceCurrentRoom;

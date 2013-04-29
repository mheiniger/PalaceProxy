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

//package net.codecomposer.palace.model
//{
//import flash.events.Event;
//import flash.events.EventDispatcher;
//import flash.events.TimerEvent;
//import flash.utils.Dictionary;
//import flash.utils.Timer;

var	ArrayCollection = require("../../mx/collections/ArrayCollection");

//import net.codecomposer.palace.event.ChatEvent;
//import net.codecomposer.palace.event.PalaceRoomEvent;
//import net.codecomposer.palace.util.PalaceUtil;
//import net.codecomposer.palace.view.PalaceRoomView;

var PalaceUser = require("./PalaceUser");

//    [Event(name="chatLogUpdated")]
//        [Event(name="chat",type="net.codecomposer.palace.event.ChatEvent")]
//        [Event(name="userEntered",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="userLeft",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="roomCleared",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="userMoved",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//
//        [Bindable]

function PalaceCurrentRoom() /* extends EventDispatcher */ {
    this.id/* :int */;
    this.name/* :String */ = "Not Connected";
    this.backgroundFile/* :String */;
    this.users/* :ArrayCollection */ = new ArrayCollection();
    this.usersHash/* :Object */ = {};
    this.roomFlags/* :int */;
    this.images/* :Object */ = {};
    this.spotImages/* :Object */ = {};
    this.hotSpots/* :ArrayCollection */ = new ArrayCollection();
    this.hotSpotsAboveNothing/* :ArrayCollection */ = new ArrayCollection();
    this.hotSpotsAboveAvatars/* :ArrayCollection */ = new ArrayCollection();
    this.hotSpotsAboveNametags/* :ArrayCollection */ = new ArrayCollection();
    this.hotSpotsAboveEverything/* :ArrayCollection */ = new ArrayCollection();
    this.hotSpotsById/* :Object */ = {};
    this.looseProps/* :ArrayCollection */ = new ArrayCollection();
    this.drawFrontCommands/* :ArrayCollection */ = new ArrayCollection();
    this.drawBackCommands/* :ArrayCollection */ = new ArrayCollection();
    this.drawLayerHistory = {};
    this._selectedUser/* :PalaceUser */;
    this.selfUserId/* :int */ = -1;
    this.roomView/* :PalaceRoomView */;
    this.dimLevel/* :Number */ = 1;
    this.showAvatars/* :Boolean */ = true;

    this.chatLog/* :String */ = "";

    this.lastMessage/* :String */;
    this.lastMessageCount/* :int */ = 0;
    this.lastMessageReceived/* :Number */ = 0;
    this.lastMessageTimer/* :Timer */ = new Timer(250, 1);

    this.statusMessageString/* :String */ = "";

    /* private */
    var statusDisappearTimer/* :Timer */ = new Timer(30000, 1);
    var classVar = this;

    // todo: add working timer class
    function Timer() {}
    function PalaceHotspot() {}
    function PalaceRoomEvent() {}
    function dispatchEvent(){}

    this.PalaceCurrentRoom = function () {
        classVar.lastMessageTimer.addEventListener(TimerEvent.TIMER, handleLastMessageTimer);
        statusDisappearTimer.addEventListener(TimerEvent.TIMER, handleStatusDisappearTimer);
    }

//        [Bindable(event="selectedUserChanged")]
    this["set selectedUser"] = /* public */ function (newValue/* :PalaceUser */) {
        if (_selectedUser !== newValue) {
            _selectedUser = newValue;
            dispatchEvent(new Event("selectedUserChanged"));
        }
    }

    this["get selectedUser"] = /* public */ function ()/* :PalaceUser */ {
        return _selectedUser;
    }

    /* private */
    function handleLastMessageTimer(event/* :Timer Event */) /* :void */ {
        this.logMessage("(Last message received " + lastMessageCount.toString() + ((lastMessageCount == 1) ? " time.)" : " times.)"));
        lastMessage = "";
        lastMessageCount = 0;
        lastMessageReceived = 0;
    }

    /* private */
    function shouldDisplayMessage(message/* :String */)/* :Boolean */ {
        var retValue/* :Boolean */ = true;
        if (lastMessage == message && lastMessageReceived > (new Date()).valueOf() - 250) {
            lastMessageTimer.stop();
            lastMessageTimer.reset();
            lastMessageTimer.start();
            lastMessageCount++;
            retValue = false;
        }
        else {
            lastMessageCount = 1;
        }
        lastMessage = message;
        lastMessageReceived = (new Date()).valueOf();
        return retValue;
    }

    /* public */
    this.getSpotImageById = function (imageId/* :int */)/* :PalaceImageOverlay */ {
        var imageOverlay/* :PalaceImageOverlay */ = PalaceImageOverlay(spotImages[imageId]);
        return imageOverlay;
    }

    /* public */
    this.addSpotImage = function (imageOverlay/* :PalaceImageOverlay */)/* :void */ {
        spotImages[imageOverlay.id] = imageOverlay;
    }

    /* public */
    this.clearSpotImages = function ()/* :void */ {
        spotImages = {}; //new Dictionary();
    }

    /* public */
    this.getHotspotById = function (spotId/* :int */)/* :PalaceHotspot */ {
        return PalaceHotspot(hotSpotsById[spotId]);
    }

    /* public */
    this.dimRoom = function (level/* :int */)/* :void */ {
        level = Math.max(0, level);
        level = Math.min(100, level);
        dimLevel = level / 100;
    }

    /* public */
    this.addLooseProp = function (id/* :int */, crc/* :uint */, x/* :int */, y/* :int */, addToFront/* :Boolean */)/* :void */ {
        addToFront = addToFront || false;
        var prop/* :PalaceLooseProp */ = new PalaceLooseProp();
        prop.x = x;
        prop.y = y;
        prop.id = id;
        prop.crc = crc;
        prop.loadProp();
        if (addToFront) {
            this.looseProps.addItem(prop);
        }
        else {
            this.looseProps.addItemAt(prop, 0);
        }
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_ADDED);
        event.looseProp = prop;
        event.addToFront = addToFront;
        dispatchEvent(event);
    }

    /* public */
    this.removeLooseProp = function (index/* :int */)/* :void */ {
        if (index == -1) {
            clearLooseProps();
        }
        else {
            this.looseProps.removeItemAt(index);
            var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_REMOVED);
            event.propIndex = index;
            dispatchEvent(event);
        }
    }

    /* public */
    this.moveLooseProp = function (index/* :int */, x/* :int */, y/* :int */)/* :void */ {
//			trace("Moving prop index " + index);
        var prop/* :PalaceLooseProp */ = PalaceLooseProp(this.looseProps.getItemAt(index));
        prop.x = x;
        prop.y = y;
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_MOVED);
        event.looseProp = prop;
        dispatchEvent(event);
    }

    /* public */
    this.clearLooseProps = function ()/* :void */ {
        this.looseProps.removeAll();
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROPS_CLEARED);
        dispatchEvent(event);
    }

    /* public */
    this.getLoosePropByIndex = function (index/* :int */)/* :PalaceLooseProp */ {
        return PalaceLooseProp(this.looseProps.getItemAt(index));
    }

    /* public */
    this.addUser = function (user/* :PalaceUser */)/* :void */ {
        this.usersHash[user.id] = user;
        this.users.addItem(user);
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.USER_ENTERED, user);
        dispatchEvent(event);
    }

    /* public */
    this.getUserById = function (id/* :int */)/* :PalaceUser */ {
        return PalaceUser(this.usersHash[id]);
    }

    /* public */
    this.getUserByName = function (name/* :String */)/* :PalaceUser */ {
        for (var user/* :PalaceUser */ in this.users) {
            if (user.name == name) {
                return user;
            }
        }
        return null;
    }

    /* public */
    this.getUserByIndex = function (userIndex/* :int */)/* :PalaceUser */ {
        return PalaceUser(this.users.getItemAt(userIndex));
    }

    /* public */
    this.getSelfUser = function ()/* :PalaceUser */ {
        return getUserById(selfUserId);
    }

    /* public */
    this.removeUser = function (user/* :PalaceUser */)/* :void */ {
        removeUserById(user.id);
    }

    /* public */
    this.removeUserById = function (id/* :int */)/* :void */ {
        var user/* :PalaceUser */ = getUserById(id);
        var index/* :int */ = this.users.getItemIndex(user);
        if (index != -1) {
            this.users.removeItemAt(this.users.getItemIndex(user));
        }
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.USER_LEFT, user);
        dispatchEvent(event);
    }

    /* public */
    this.removeAllUsers = function ()/* :void */ {
        this.usersHash = {};
        this.users.removeAll();
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.ROOM_CLEARED);
        dispatchEvent(event);
    }

    /* public */
    this.chat = function (userId/* :int */, message/* :String */, logMessage/* :String */)/* :void */ {
        logMessage = logMessage || null;

        var user/* :PalaceUser */ = getUserById(userId);

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
    }

    /* public */
    this.whisper = function (userId/* :int */, message/* :String */, logMessage/* :String */)/* :void */ {
        logMessage = logMessage || null;
        var user/* :PalaceUser */ = getUserById(userId);
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
    }

    /* public */
    this.localMessage = function (message/* :String */)/* :void */ {
        roomMessage(message);
    }

    /* public */
    this.roomMessage = function (message/* :String */)/* :void */ {
        if (shouldDisplayMessage(message) && message.length > 0) {
            recordChat("<b>*** " + PalaceUtil.htmlEscape(message), "</b>\n");
            dispatchEvent(new Event('chatLogUpdated'));
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.ROOM_MESSAGE, message);
            dispatchEvent(event);
        }
    }

    /* private */
    function handleStatusDisappearTimer(event/* :Timer Event */)/* :void */ {
        clearStatusMessage();
    }

    /* public */
    this.clearStatusMessage = function ()/* :void */ {
        statusMessageString = "";
    }

    /* public */
    this.statusMessage = function (message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        statusMessageString = message;
        statusDisappearTimer.reset();
        statusDisappearTimer.start();
        dispatchEvent(new Event('chatLogUpdated'));
    }

    /* public */
     this.logMessage = function(message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        dispatchEvent(new Event('chatLogUpdated'));
    }

    /* public */
    this.logScript = function (message/* :String */)/* :void */ {
        recordChat("<font face=\"Courier New\">" + PalaceUtil.htmlEscape(message) + "</font>\n")
        dispatchEvent(new Event('chatLogUpdated'));
    }

    /* public */
    this.roomWhisper = function (message/* :String */)/* :void */ {
        if (shouldDisplayMessage(message) && message.length > 0) {
            recordChat("<b><i>*** " + PalaceUtil.htmlEscape(message), "</i></b>\n");
            dispatchEvent(new Event('chatLogUpdated'));
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.ROOM_MESSAGE, message);
            dispatchEvent(event);
        }
    }

    /* private */
    function recordChat()/* :void */ {
        var temp/* :String */ = "";
        if (chatLog.length > 2) {
            temp = chatLog.substr(0, chatLog.length - 1);
        }
        for (var i/* :int */ = 0; i < arguments.length; i++) {
            temp += arguments[i];
        }
        chatLog = temp + "\n";
    }

    /* public */
    this.moveUser = function (userId/* :int */, x/* :int */, y/* :int */)/* :void */ {
        var user/* :PalaceUser */ = getUserById(userId);
        user.x = x;
        user.y = y;
        var event/* :PalaceRoomEvent */ = new PalaceRoomEvent(PalaceRoomEvent.USER_MOVED, user);
        dispatchEvent(event);
//			trace("User " + userId + " moved to " + x + "," + y);

    }

    function trace(text) {
        console.log(text);
    }
}

module.exports = PalaceCurrentRoom;
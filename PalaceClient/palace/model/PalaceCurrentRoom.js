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
var util = require('util');
var Event = require("../../adapter/events/Event");
var EventDispatcher = require("../../adapter/events/EventDispatcher");
//import flash.events.EventDispatcher;
//import flash.events.TimerEvent;
//import flash.utils.Dictionary;
//import flash.utils.Timer;

var ArrayCollection = require("../../adapter/collections/ArrayCollection");
var PalaceRoomEvent = require("../../palace/event/PalaceRoomEvent");
var ChatEvent = require("../../palace/event/ChatEvent");
var PalaceUtil = require("../../palace/util/PalaceUtil");
//import net.codecomposer.palace.view.PalaceRoomView;

var PalaceUser = require("../../palace/model/PalaceUser");

//    [Event(name="chatLogUpdated")]
//        [Event(name="chat",type="net.codecomposer.palace.event.ChatEvent")]
//        [Event(name="userEntered",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="userLeft",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="roomCleared",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//        [Event(name="userMoved",type="net.codecomposer.palace.event.PalaceRoomEvent")]
//
//        [Bindable]

util.inherits(PalaceCurrentRoom, EventDispatcher);
/* extends EventDispatcher */
function PalaceCurrentRoom() {
    PalaceCurrentRoom.super_.call(this);
    var that = this;

    var id = this.id/* :int */;
    var name = this.name/* :String */ = "Not Connected";
    this.backgroundFile/* :String */ = '';
    this.users/* :Array Collection */ = new ArrayCollection();
    this.usersHash/* :Object */ = {};
    var roomFlags = this.roomFlags/* :int */;
    var images = this.images/* :Object */ = {};
    var spotImages = this.spotImages/* :Object */ = {};
    var hotSpots = this.hotSpots/* :Array Collection */ = new ArrayCollection();
    var hotSpotsAboveNothing = this.hotSpotsAboveNothing/* :Array Collection */ = new ArrayCollection();
    var hotSpotsAboveAvatars = this.hotSpotsAboveAvatars/* :Array Collection */ = new ArrayCollection();
    var hotSpotsAboveNametags = this.hotSpotsAboveNametags/* :Array Collection */ = new ArrayCollection();
    var hotSpotsAboveEverything = this.hotSpotsAboveEverything/* :Array Collection */ = new ArrayCollection();
    var hotSpotsById = this.hotSpotsById/* :Object */ = {};
    var looseProps = this.looseProps/* :Array Collection */ = new ArrayCollection();
    var drawFrontCommands = this.drawFrontCommands/* :Array Collection */ = new ArrayCollection();
    var drawBackCommands = this.drawBackCommands/* :Array Collection */ = new ArrayCollection();
    this.drawLayerHistory/* :Vector.<uint> */ = [];
    var _selectedUser = this._selectedUser/* :PalaceUser */;
    this.selfUserId/* :int */ = -1;
    var roomView = this.roomView/* :PalaceRoom View */;
    var dimLevel = this.dimLevel/* :Number */ = 1;
    var showAvatars = this.showAvatars/* :Boolean */ = true;

    var chatLog = this.chatLog/* :String */ = "";

    var lastMessage = this.lastMessage/* :String */;
    var lastMessageCount = this.lastMessageCount/* :int */ = 0;
    var lastMessageReceived = this.lastMessageReceived/* :Number */ = 0;
    var lastMessageTimer = this.lastMessageTimer/* :Timer */ = new Timer(250, 1);

    var statusMessageString = this.statusMessageString/* :String */ = "";

    var statusDisappearTimer/* :Timer */ = new Timer(30000, 1);

    // todo: add working timer class
    function Timer() {
    }

    function dispatchEvent(object) {
        trace("PalaceCurrentRoom dispatches event: " + object.type);
        that.dispatchEvent(object.type, object);
    }


    this.PalaceCurrentRoomConstructor = function () {
        // todo: implement
        //lastMessageTimer.addEventListener(TimerEvent.TIMER, handleLastMessageTimer);
        //statusDisappearTimer.addEventListener(TimerEvent.TIMER, handleStatusDisappearTimer);
    }()

//		[Bindable(event="selectedUserChanged")]
    var set_selectedUser = this.set_selectedUser = function (newValue/* :PalaceUser */)/* :void */ {
        if (_selectedUser !== newValue) {
            _selectedUser = newValue;
            dispatchEvent(new Event("selectedUserChanged"));
        }
    }

    var get_selectedUser = this.get_selectedUser = function ()/* :PalaceUser */ {
        return _selectedUser;
    }

    /* private */
    function handleLastMessageTimer(event/* :Timer Event */)/* :void */ {
        logMessage("(Last message received " + lastMessageCount.toString() + ((lastMessageCount == 1) ? " time.)" : " times.)"));
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

    var getSpotImageById = this.getSpotImageById = function (imageId/* :int */)/* :PalaceImageOverlay */ {
        var imageOverlay/* :PalaceImageOverlay */ = PalaceImageOverlay(spotImages[imageId]);
        return imageOverlay;
    }

    var addSpotImage = this.addSpotImage = function (imageOverlay/* :PalaceImageOverlay */)/* :void */ {
        spotImages[imageOverlay.id] = imageOverlay;
    }

    var clearSpotImages = this.clearSpotImages = function ()/* :void */ {
        spotImages = {}; //new Dictionary();
    }

    var getHotspotById = this.getHotspotById = function (spotId/* :int */)/* :PalaceHotspot */ {
        return hotSpotsById[spotId];
    }

    var dimRoom = this.dimRoom = function (level/* :int */)/* :void */ {
        level = Math.max(0, level);
        level = Math.min(100, level);
        dimLevel = level / 100;
    }

    var addLooseProp = this.addLooseProp = function (id/* :int */, crc/* :uint */, x/* :int */, y/* :int */, addToFront/* :Boolean */)/* :void */ {
        addToFront = addToFront || false;
        var prop/* :PalaceLooseProp */ = new PalaceLooseProp();
        prop.x = x;
        prop.y = y;
        prop.id = id;
        prop.crc = crc;
        prop.loadProp();
        if (addToFront) {
            looseProps.addItem(prop);
        }
        else {
            looseProps.addItemAt(prop, 0);
        }
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_ADDED);
        event.looseProp = prop;
        event.addToFront = addToFront;
        dispatchEvent(event);
    }

    var removeLooseProp = this.removeLooseProp = function (index/* :int */)/* :void */ {
        if (index == -1) {
            clearLooseProps();
        }
        else {
            looseProps.removeItemAt(index);
            var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_REMOVED);
            event.propIndex = index;
            dispatchEvent(event);
        }
    }

    var moveLooseProp = this.moveLooseProp = function (index/* :int */, x/* :int */, y/* :int */)/* :void */ {
//			trace("Moving prop index " + index);
        var prop/* :PalaceLooseProp */ = PalaceLooseProp(looseProps.getItemAt(index));
        prop.x = x;
        prop.y = y;
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROP_MOVED);
        event.looseProp = prop;
        dispatchEvent(event);
    }

    var clearLooseProps = this.clearLooseProps = function ()/* :void */ {
        looseProps.removeAll();
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.LOOSE_PROPS_CLEARED);
        dispatchEvent(event);
    }

    var getLoosePropByIndex = this.getLoosePropByIndex = function (index/* :int */)/* :PalaceLooseProp */ {
        return PalaceLooseProp(looseProps.getItemAt(index));
    }

    var addUser = this.addUser = function (user/* :PalaceUser */)/* :void */ {
        that.usersHash[user.id] = user;
        that.users.addItem(user);

        user.on('faceChanged', function () {
            var event = new Event("faceChanged");
            event.user = user;
            dispatchEvent(event);
        });

        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_ENTERED, user);
        dispatchEvent(event);
    }

    var getUserById = this.getUserById = function (id/* :int */)/* :PalaceUser */ {
        return that.usersHash[id];
    }

    var getUserByName = this.getUserByName = function (name/* :String */)/* :PalaceUser */ {
        for (var user/* :PalaceUser */ in that.users) {
            if (user.name == name) {
                return user;
            }
        }
        return null;
    }

    var getUserByIndex = this.getUserByIndex = function (userIndex/* :int */)/* :PalaceUser */ {
        return that.users.getItemAt(userIndex);
    }

    var getSelfUser = this.getSelfUser = function ()/* :PalaceUser */ {
        return getUserById(that.selfUserId);
    }

    var removeUser = this.removeUser = function (user/* :PalaceUser */)/* :void */ {
        removeUserById(user.id);
    }

    var removeUserById = this.removeUserById = function (id/* :int */)/* :void */ {
        var user/* :PalaceUser */ = getUserById(id);
        var index/* :int */ = that.users.getItemIndex(user);
        if (index != -1) {
            that.users.removeItemAt(that.users.getItemIndex(user));
        }
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_LEFT, user);
        dispatchEvent(event);
    }

    var removeAllUsers = this.removeAllUsers = function ()/* :void */ {
        that.usersHash = {};
        that.users.removeAll();
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.ROOM_CLEARED);
        dispatchEvent(event);
    }

    var chat = this.chat = function (userId/* :int */, message/* :String */, logMessage/* :String  = null*/)/* :void */ {
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

    var whisper = this.whisper = function (userId/* :int */, message/* :String */, logMessage/* :String */)/* :void */ {
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

    var localMessage = this.localMessage = function (message/* :String */)/* :void */ {
        roomMessage(message);
    }

    var roomMessage = this.roomMessage = function (message/* :String */)/* :void */ {
        if (shouldDisplayMessage(message) && message.length > 0) {
            recordChat("<b>*** " + PalaceUtil.htmlEscape(message), "</b>\n");
            dispatchEvent(new Event('chatLogUpdated'));
            var event/* :ChatEvent */ = new ChatEvent(ChatEvent.ROOM_MESSAGE, message);
            dispatchEvent(event);
        }
    }

    function handleStatusDisappearTimer(event/* :Timer Event */)/* :void */ {
        clearStatusMessage();
    }

    var clearStatusMessage = this.clearStatusMessage = function ()/* :void */ {
        statusMessageString = "";
    }

    var statusMessage = this.statusMessage = function (message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        statusMessageString = message;
        statusDisappearTimer.reset();
        statusDisappearTimer.start();
        dispatchEvent(new Event('chatLogUpdated'));
    }

    var logMessage = this.logMessage = function (message/* :String */)/* :void */ {
        recordChat("<i>" + message + "</i>\n");
        dispatchEvent(new Event('chatLogUpdated'));
    }

    var logScript = this.logScript = function (message/* :String */)/* :void */ {
        recordChat("<font face=\"Courier New\">" + PalaceUtil.htmlEscape(message) + "</font>\n")
        dispatchEvent(new Event('chatLogUpdated'));
    }

    var roomWhisper = this.roomWhisper = function (message/* :String */)/* :void */ {
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

    var moveUser = this.moveUser = function (userId/* :int */, x/* :int */, y/* :int */)/* :void */ {
        var user/* :PalaceUser */ = getUserById(userId);
        user.x = x;
        user.y = y;
        var event/* :PalaceRoom Event */ = new PalaceRoomEvent(PalaceRoomEvent.USER_MOVED, user);
        dispatchEvent(event);
//			trace("User " + userId + " moved to " + x + "," + y);

    }

    function trace(text) {
        console.log(text);
    }
}

module.exports = PalaceCurrentRoom;

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

var net = require('net');
var util = require('util');

function PalaceClient() // extends EventDispatcher
{
    var importClasses = {};
    function importClass(namespace){
        var className = namespace.split(".").slice(-1)[0];
        importClasses[className] = require("./" + namespace.replace(/\./g, '/') +'.js');
        console.log('> loading ' + className);
    }

    //import com.adobe.net.URI;

    //import flash.events.Event;
    //import flash.events.EventDispatcher;
    //import flash.events.IOErrorEvent;
    //import flash.events.ProgressEvent;
    //import flash.events.SecurityErrorEvent;
    //import flash.events.TimerEvent;
    //import flash.net.SharedObject;
    //import flash.net.Socket;
    //import flash.net.XMLSocket;
    //import flash.system.LoaderContext;
    //import flash.utils.ByteArray;
    //import flash.utils.Endian;
    //import flash.utils.Timer;
    //import flash.utils.setTimeout;

    importClass("mx.collections.ArrayCollection");
    //import mx.controls.Alert;
    //importClass("openpalace.accountserver.rpc.AccountServerClient");
    //importClass("palace.crypto.PalaceEncryption");
    importClass("palace.event.PalaceEvent");
    //importClass("palace.event.PalaceSecurityErrorEvent");
    //importClass("palace.event.PropEvent");
    //importClass("palace.iptscrae.DebugData");
    //importClass("palace.iptscrae.IptEventHandler");
    //importClass("palace.iptscrae.PalaceController");
    importClass("palace.message.IncomingMessageTypes");
    //importClass("palace.message.NavErrorMessage");
    importClass("palace.message.OutgoingMessageTypes");
    //importClass("palace.model.AssetManager");
    //importClass("palace.model.PalaceAsset");
    //importClass("palace.model.PalaceConfig");
    importClass("palace.model.PalaceCurrentRoom");
    //importClass("palace.model.PalaceHotspot");
    //importClass("palace.model.PalaceImageOverlay");
    //importClass("palace.model.PalaceLooseProp");
    //importClass("palace.model.PalaceProp");
    //importClass("palace.model.PalacePropStore");
    //importClass("palace.model.PalaceRoom");
    importClass("palace.model.PalaceServerInfo");

    //importClass("palace.model.PalaceUser");
    //importClass("palace.record.PalaceChatRecord");
    //importClass("palace.record.PalaceDrawRecord");
    //importClass("palace.view.PalaceSoundPlayer");
    //
    //importClass("org.openpalace.iptscrae.IptEngineEvent");
    //importClass("org.openpalace.iptscrae.IptTokenList");
    //importClass("org.openpalace.registration.RegistrationCode");

    //[Event(type="net.codecomposer.event.PalaceEvent",name="connectStart")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="connectComplete")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="connectFailed")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="disconnected")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="gotoURL")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="roomChanged")]
    //[Event(type="net.codecomposer.event.PalaceEvent",name="authenticationRequested")]
    //[Event(type="net.codecomposer.event.PalaceSecurityErrorEvent",name="securityError")]

    // import class-namespaces
    for (var className in importClasses) {
        eval('var ' + className + ' =  importClasses.' + className);
    }

    var instance;

    //    var loaderContext = new LoaderContext();

    /* FLAGS */
    var AUXFLAGS_UNKNOWN_MACHINE = 0;
    var AUXFLAGS_MAC68K = 1;
    var AUXFLAGS_MACPPC = 2;
    var AUXFLAGS_WIN16 = 3;
    var AUXFLAGS_WIN32 = 4;
    var AUXFLAGS_JAVA = 5;

    var AUXFLAGS_OSMASK = 0x0000000F;
    var AUXFLAGS_AUTHENTICATE = 0x80000000;

    var ULCAPS_ASSETS_PALACE = 0x00000001;
    var ULCAPS_ASSETS_FTP = 0x00000002;
    var ULCAPS_ASSETS_HTTP = 0x00000004;
    var ULCAPS_ASSETS_OTHER = 0x00000008;
    var ULCAPS_FILES_PALACE = 0x00000010;
    var ULCAPS_FILES_FTP = 0x00000020;
    var ULCAPS_FILES_HTTP = 0x00000040;
    var ULCAPS_FILES_OTHER = 0x00000080;
    var ULCAPS_EXTEND_PKT = 0x00000100;

    var DLCAPS_ASSETS_PALACE = 0x00000001;
    var DLCAPS_ASSETS_FTP = 0x00000002;
    var DLCAPS_ASSETS_HTTP = 0x00000004;
    var DLCAPS_ASSETS_OTHER = 0x00000008;
    var DLCAPS_FILES_PALACE = 0x00000010;
    var DLCAPS_FILES_FTP = 0x00000020;
    var DLCAPS_FILES_HTTP =  0x00000040;
    var DLCAPS_FILES_OTHER = 0x00000080;
    var DLCAPS_FILES_HTTPSRVR = 0x00000100;
    var DLCAPS_EXTEND_PKT = 0x00000200;

    var socket = null;

//    var accountClient = AccountServerClient.getInstance();

    var version;
    var id = 0;

    // Variables to keep state between packets if we didn't have enough
    // data available in the first packet.
    var messageID = 0;
    var messageSize = 0;
    var messageP = 0;
    var waitingForMore = false;

    
    var debugData;
    var utf8 = false;
    var port = 0;
    var host = null;
    var initialRoom = 0;
    var state = STATE_DISCONNECTED;
    var connected = false;
    var connecting = false;
    var serverName = "No Server";
    var serverInfo = new PalaceServerInfo();

    var population = 0;
    var mediaServer = "";
    var userList = new ArrayCollection();

    var currentRoom = new PalaceCurrentRoom();

    var roomList = new ArrayCollection();
    var roomById = {};
    var chatstr = "";
    var whochat = 0;
    var needToRunSignonHandlers = true;
    var assetRequestQueueTimer = null;
    var assetRequestQueue = [];
    var assetRequestQueueCounter = 0;
    var assetsLastRequestedAt = new Date();
    var chatQueue = {};
    var currentChatItem;
    var puidChanged = false;
    var puidCounter = 0xf5dc385e;
    var puidCRC = 0xc144c580;
    var regCounter = 0xcf07309c;
    var regCRC = 0x5905f923;

    var recentLogonUserIds = new ArrayCollection();
    var cyborgHotspot = {} // new PalaceHotspot();
    var muteSounds;
    var _userName = "OpenPalace User";
    var sharedObject;

    
    var palaceController;

    var temporaryUserFlags;
    // We get the user flags before we have the current user

    function getUserName() {
        return _userName;
    }

//	function ArrayCollection() {
//		 return {};
//	}

    function setUserName(newValue) {
        if (newValue.length > 31) {
            newValue = newValue.slice(0, 31);
        }
        _userName = newValue;
        dispatchEvent(new Event('userNameChange'));
    }

    // States
    var STATE_DISCONNECTED = 0;
    var STATE_HANDSHAKING = 1;
    var STATE_READY = 2;

    function getInstance() {
        if (PalaceClient.instance == null) {
            PalaceClient.instance = new PalaceClient();
        }
        return PalaceClient.instance;
    }

    function PalaceClient()
    {
        if (PalaceClient.instance != null) {
            throw new Error("Cannot create more than one instance of a singleton.");
        }

        palaceController = new PalaceController();
        palaceController.client = this;
    }

    function setCyborg(cyborgScript) {
        cyborgHotspot = new PalaceHotspot();
        cyborgHotspot.scriptString = cyborgScript;
        cyborgHotspot.loadScripts();
    }

    function setRegistrationCode(regCode) {
        if (regCode && regCode.length >= 13) {
            var code = RegistrationCode.fromString(regCode);
            regCounter = code.counter;
            regCRC = code.crc;
        }
        else {
            regCounter = 0xcf07309c;
            regCRC = 0x5905f923;
        }
    }

    function setPuid(puid) {
        puidCounter = puid.counter;
        puidCRC = puid.crc;
    }

    function gotoURL(url) {
        var event = new PalaceEvent('gotoURL');
        event.url = url;
        dispatchEvent(event);
    }

    function resetState() {
        //palaceController.midiStop();
        //palaceController.clearAlarms();
        needToRunSignonHandlers = true;
        messageID = 0;
        messageSize = 0;
        messageP = 0;
        connected = false;
        currentRoom.name = "No Room";
        currentRoom.users.removeAll();
        currentRoom.usersHash = {};
        currentRoom.backgroundFile = null;
        currentRoom.selectedUser = null;
        currentRoom.removeAllUsers();
        currentRoom.clearLooseProps();
        currentRoom.hotSpots.removeAll();
        currentRoom.hotSpotsAboveAvatars.removeAll();
        currentRoom.hotSpotsAboveEverything.removeAll();
        currentRoom.hotSpotsAboveNametags.removeAll();
        currentRoom.hotSpotsAboveNothing.removeAll();
        currentRoom.drawBackCommands.removeAll();
        currentRoom.drawFrontCommands.removeAll();
        currentRoom.drawLayerHistory = {};
        currentRoom.showAvatars = true;
        currentRoom.id = 0;
        population = 0;
        serverName = "No Server";
        roomList.removeAll();
        console.log('resetState ok');
        userList.removeAll();

        socket = null;
        if (puidChanged) {
            trace("Server changed our puid and needs us to reconnect.");
            puidChanged = false;
            connect(userName, host, port);
        }
    }

    // ***************************************************************
    // Begin public functions for user interaction
    // ***************************************************************
    var buffers = new Array();

    function connect(userName, host, port, initialRoom) {
        port = port || '9998';
        initialRoom = initialRoom || '0';
        
//        PalaceClient.loaderContext.checkPolicyFile = true;

        host = host.toLowerCase();
        var match = host.match(/^palace:\/\/(.*)$/);
        if (match && match.length > 0) {
            host = match[1];
        }

        this.host = host;
        this.port = port;
        this.initialRoom = initialRoom;
        this.userName = userName;

        if (connected || (socket && socket.connected)) {
            disconnect();
        }
        else {
            resetState();
        }
        connecting = true;
        console.log('before-connect');
        dispatchEvent(new PalaceEvent(PalaceEvent.CONNECT_START));

        setupBuffer();
        socket = new net.Socket();
        extendSocket();
        socket.timeout = 5000;
        socket.on("close", onClose);
        socket.on("data", onSocketData);
        socket.on("error", onIOError);

        socket.connect(this.port, this.host, onConnect);
    }
    this.connect = connect;

    function dispatchEvent(object) {
        object.emit;
    }

    function extendSocket() {
        socket.writeInt = function(data) {
            console.log('sending',data);
            var buffer = new Buffer(4);
            if (socket.endian == "littleEndian") {
                buffer.writeUInt32LE(0);
            } else {
                buffer.writeUInt32BE(0);
            }
            socket.write(buffer);
        }
    }

    function setupBuffer(){
        Buffer.prototype.readInt = function(){
            that = this;
            if (socket.endian == "littleEndian") {
                var data = this.readUInt32LE(0);
                return this.slice(4)
            } else if (socket.endian == "bigEndian"){
                var data = this.readUInt32BE(0);
                return this.slice(4);
            } else {
                console.log('endianness not set, can\'t read!!');
            }
        }

        Buffer.prototype.writeInt = function(data){
            if (socket.endian == "littleEndian") {
                return this.writeUInt32LE(0);
            } else {
                return this.writeUInt32BE(0);
            }
        }
    }

    function authenticate(username, password) {
        if (socket && socket.connected) {
				trace("Sending auth response");
            var userPass = PalaceEncryption.getInstance().encrypt(username + ":" + password);
            socket.writeInt(OutgoingMessageTypes.AUTHRESPONSE);
            socket.writeInt(userPass.length + 1);
            socket.writeInt(0);
            socket.writeByte(userPass.length);
            socket.writeBytes(userPass);
            socket.flush();
        }
    }

    function disconnect() {
        palaceController.midiStop();
        if (socket && socket.connected) {
            palaceController.triggerHotspotEvents(IptEventHandler.TYPE_LEAVE);
            palaceController.triggerHotspotEvents(IptEventHandler.TYPE_SIGNOFF);
            socket.writeInt(OutgoingMessageTypes.BYE);
            socket.writeInt(0);
            socket.writeInt(id);
            socket.flush();
            socket.close();
        }
        resetState();
    }
    
    function trace(text) {
		console.log(text);
    }
    
    function changeName(newName) {
        this.userName = newName;
        if (socket && socket.connected) {
            socket.writeInt(OutgoingMessageTypes.CHANGE_NAME);
            socket.writeInt(this.userName.length + 1);
            socket.writeInt(0);
            socket.writeByte(this.userName.length);
            socket.writeMultiByte(this.userName, 'Windows-1252');
            socket.flush();
        }
    }

    function roomChat(message) {
        if (!connected || message == null || message.length == 0) {
            return;
        }
        trace("Saying: " + message);
        var messageBytes = PalaceEncryption.getInstance().encrypt(message, utf8, 254);
        messageBytes.position = 0;

        socket.writeInt(OutgoingMessageTypes.SAY);
        socket.writeInt(messageBytes.length + 3);
        socket.writeInt(id);
        socket.writeShort(messageBytes.length + 3);
        socket.writeBytes(messageBytes);
        socket.writeByte(0);
        socket.flush();
    }

    function privateMessage(message, userId) {
        if (!connected || message == null || message.length == 0) {
            return;
        }

        var messageBytes = PalaceEncryption.getInstance().encrypt(message, utf8, 254);
        messageBytes.position = 0;

        socket.writeInt(OutgoingMessageTypes.WHISPER);
        socket.writeInt(messageBytes.length + 7); // length + 2 bytes for short, + 4 bytes for id
        socket.writeInt(id);
        socket.writeInt(userId);
        socket.writeShort(messageBytes.length + 3);
        socket.writeBytes(messageBytes);
        socket.writeByte(0);
        socket.flush();
    }

    function say(message) {
        if (!connected || message == null || message.length == 0) {
            return;
        }

        if (handleClientCommand(message)) { return; }

        if (message.charAt(0) == "/") {
            // Run iptscrae
            palaceController.executeScript(message.substr(1));
            return;
        }

        if (message.toLocaleLowerCase() == "clean") {
            deleteLooseProp(-1); // clear loose props
            palaceController.paintClear();
            return;
        }

        var selectedUserId = currentRoom.selectedUser ?
            currentRoom.selectedUser.id : 0;

        var chatRecord = new PalaceChatRecord(
            PalaceChatRecord.OUTCHAT,
            currentUser.id,
            selectedUserId,
            message,
            currentRoom.selectedUser ? true : false
        );
        chatRecord.eventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_OUTCHAT);
        chatQueue.push(chatRecord);
        processChatQueue();
    }

    function globalMessage(message) {
        if (!connected || message == null || message.length == 0) {
            return;
        }

        if (message.length > 254) {
            message = message.substr(0, 254);
        }
        trace("GLOBALMSG");
        var messageBytes = new ByteArray();
        messageBytes.writeMultiByte(message, "Windows-1252");
        messageBytes.position = 0;

        socket.writeInt(OutgoingMessageTypes.GLOBAL_MSG);
        socket.writeInt(messageBytes.length + 1);
        socket.writeInt(0);

        socket.writeBytes(messageBytes);
        socket.writeByte(0);
        socket.flush()
    }

    function roomMessage(message) {
        if (!connected || message == null || message.length == 0) {
            return;
        }
//			trace("ROOMMSG");
        if (message.length > 254) {
            message = message.substr(0, 254);
        }

        var messageBytes = new ByteArray();
        messageBytes.writeMultiByte(message, "Windows-1252");
        messageBytes.position = 0;

        socket.writeInt(OutgoingMessageTypes.ROOM_MSG);
        socket.writeInt(messageBytes.length + 1);
        socket.writeInt(0);

        socket.writeBytes(messageBytes);
        socket.writeByte(0);
        socket.flush()
    }

    function superUserMessage(message) {
        if (!connected || message == null || message.length == 0) {
            return;
        }
//			trace("SUSRMSG");
        if (message.length > 254) {
            message = message.substr(0, 254);
        }

        var messageBytes = new ByteArray();
        messageBytes.writeMultiByte(message, "Windows-1252");
        messageBytes.position = 0;

        socket.writeInt(OutgoingMessageTypes.SUSR_MSG);
        socket.writeInt(messageBytes.length + 1);
        socket.writeInt(0);

        socket.writeBytes(messageBytes);
        socket.writeByte(0);
        socket.flush()
    }

    function handleClientCommand(message) {
        var clientCommandMatch = message.match(/^~(\w+) (.*)$/);
        if (clientCommandMatch && clientCommandMatch.length > 0) {
            var command = clientCommandMatch[1];
            var argument = clientCommandMatch[2];
            switch (command) {
                case "susr":
//						trace("You are attempting to become a superuser with password \"" +
//								argument + "\"");
                    becomeWizard(argument);
                    break;
                default:
                    trace("Unrecognized command: " + command + " argument " + argument);
            }
            return true;
        }
        else {
            return false;
        }
    }

    function becomeWizard(password) {
        var passwordBytes = PalaceEncryption.getInstance().encrypt(password, false);
        passwordBytes.position = 0;
        socket.writeInt(OutgoingMessageTypes.SUPERUSER);
        socket.writeInt(passwordBytes.length + 1);
        socket.writeInt(0);
        socket.writeByte(passwordBytes.length);
        socket.writeBytes(passwordBytes);
        socket.flush();
    }

    function move(x, y) {
        if (!connected || !currentUser) {
            return;
        }

        x = Math.max(x, 22);
        x = Math.min(x, currentRoom.roomView.backgroundImage.width - 22);

        y = Math.max(y, 22);
        y = Math.min(y, currentRoom.roomView.backgroundImage.height - 22);

        socket.writeInt(OutgoingMessageTypes.MOVE);
        socket.writeInt(4);
        socket.writeInt(id);
        socket.writeShort(y);
        socket.writeShort(x);
        socket.flush();

        currentUser.x = x;
        currentUser.y = y;
    }

    function setFace(face) {
        if (!connected || currentUser.face == face) {
            return;
        }
        socket.writeInt(OutgoingMessageTypes.USER_FACE);
        socket.writeInt(2);
        socket.writeInt(id);
        face = Math.max(Math.min(face, 15), 0);
        socket.writeShort(face);
        currentUser.face = face;
        socket.flush();
    }

    function setColor(color) {
        if (!connected || currentUser.color == color) {
            return;
        }
        color = Math.max(Math.min(color, 15), 0);
        currentUser.color = color;
        socket.writeInt(OutgoingMessageTypes.USER_COLOR);
        socket.writeInt(2);
        socket.writeInt(id);
        socket.writeShort(color);
        socket.flush();
    }

    function requestRoomList() {
        if (!connected) {
            return;
        }
        socket.writeInt(OutgoingMessageTypes.REQUEST_ROOM_LIST);
        socket.writeInt(0);
        socket.writeInt(0);
        socket.flush();
    }

    function requestUserList() {
        if (!connected) {
            return;
        }
        socket.writeInt(OutgoingMessageTypes.REQUEST_USER_LIST);
        socket.writeInt(0);
        socket.writeInt(id);
        socket.flush();
    }

    var leaveEventHandlers;
    var requestedRoomId = 0;

    function gotoRoom(roomId) {
        if (!connected || currentRoom.id == roomId) {
            return;
        }

        needToRunSignonHandlers = false;

        requestedRoomId = roomId;

        leaveEventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_LEAVE);
        if (leaveEventHandlers) {
            for (var handler in leaveEventHandlers) {
                handler.addEventListener(IptEngineEvent.FINISH, handleLeaveEventHandlersFinish);
            }
            palaceController.triggerHotspotEvents(IptEventHandler.TYPE_LEAVE);
        }
        else {
            actuallyGotoRoom(roomId);
        }
    }

    function handleLeaveEventHandlersFinish(event) {
        if (leaveEventHandlers == null) {
            actuallyGotoRoom(requestedRoomId);
        }

        // Make sure each ON LEAVE handler has finished before actually
        // leaving the room.
        var index = leaveEventHandlers.indexOf(IptTokenList(event.target));
        if (index != -1) {
            leaveEventHandlers.splice(index, 1);
        }
        if (leaveEventHandlers.length < 1) {
            actuallyGotoRoom(requestedRoomId);
            leaveEventHandlers = null;
            requestedRoomId = 0;
        }
    }

    function actuallyGotoRoom(roomId) {
        if (!connected) {
            return;
        }
        socket.writeInt(OutgoingMessageTypes.GOTO_ROOM);
        socket.writeInt(2); // length
        socket.writeInt(id);
        socket.writeShort(roomId);
        socket.flush();

        currentRoom.selectedUser = null;
    }

    function lockDoor(roomId, spotId) {
        socket.writeInt(OutgoingMessageTypes.DOOR_LOCK);
        socket.writeInt(4);
        socket.writeInt(0);
        socket.writeShort(roomId);
        socket.writeShort(spotId);
        socket.flush();
    }

    function unlockDoor(roomId, spotId) {
        socket.writeInt(OutgoingMessageTypes.DOOR_UNLOCK);
        socket.writeInt(4);
        socket.writeInt(0);
        socket.writeShort(roomId);
        socket.writeShort(spotId);
        socket.flush();
    }

    function setSpotState(roomId, spotId, spotState) {
//			trace("Setting spot state");
        socket.writeInt(OutgoingMessageTypes.SPOT_STATE);
        socket.writeInt(6);
        socket.writeInt(0);
        socket.writeShort(roomId);
        socket.writeShort(spotId);
        socket.writeShort(spotState);
        socket.flush();
    }

    function moveLooseProp(propIndex, x, y) {
        socket.writeInt(OutgoingMessageTypes.PROP_MOVE);
        socket.writeInt(8);
        socket.writeInt(0);
        socket.writeInt(propIndex);
        socket.writeShort(y);
        socket.writeShort(x);
        socket.flush();
    }

    function addLooseProp(propId, propCrc, x, y) {
        socket.writeInt(OutgoingMessageTypes.PROP_NEW);
        socket.writeInt(12);
        socket.writeInt(0);

        socket.writeInt(propId);
        socket.writeUnsignedInt(propCrc);
        socket.writeShort(y);
        socket.writeShort(x);

        socket.flush();
    }

    function deleteLooseProp(propIndex) {
        socket.writeInt(OutgoingMessageTypes.PROP_DELETE);
        socket.writeInt(4);
        socket.writeInt(0);

        socket.writeInt(propIndex);

        socket.flush();
    }

    function sendDrawPacket(drawRecord) {
        var data = drawRecord.generatePacket(socket.endian);
        socket.writeInt(OutgoingMessageTypes.DRAW);
        socket.writeInt(data.length);
        socket.writeInt(0);
        socket.writeBytes(data);
        socket.flush();
    }

    function requestAsset(assetType, assetId, assetCrc) {
        // Assets are requested in packets of up to 20 requests, separated by 500ms
        // to prevent flooding the server and getting killed.
        if (!connected) {
            return;
        }
//			trace("Requesting asset (Type:" + assetType.toString(16) + ") (ID:" + assetId + ") (CRC:" + assetCrc + ")");
        if (assetRequestQueueTimer == null) {
            assetRequestQueueTimer = new Timer(50, 1);
            assetRequestQueueTimer.addEventListener(TimerEvent.TIMER, sendAssetRequests);
            assetRequestQueueTimer.start();
        }

        assetRequestQueue.push([
            assetType,
            assetId,
            assetCrc
        ]);

        assetRequestQueueTimer.reset();
        assetRequestQueueTimer.start();
    }

    function sendAssetRequests(event) {
        if (!connected || !socket || !socket.connected) {
            assetRequestQueue = [];
            return;
        }

        if (assetRequestQueue.length == 0) {
            assetRequestQueueTimer.reset();
            assetRequestQueueTimer.delay = 50;
            return;
        }

        // only do 20 requests at a time
        var count = (assetRequestQueue.length > 20) ? 20 : assetRequestQueue.length;

//			trace("Requesting a group of props");
        for (var i = 0; i < count; i++) {
            var request = assetRequestQueue.shift().toArray();
            socket.writeInt(OutgoingMessageTypes.REQUEST_ASSET);
            socket.writeInt(12);
            socket.writeInt(id);
            for (var j = 0; j < 3; j++) {
                socket.writeInt(request[j]);
            }
        }
        socket.flush();

        // If there are still assets left to request, schedule another timer.
        if (assetRequestQueue.length > 0) {
            assetRequestQueueTimer.reset();
            assetRequestQueueTimer.delay = 500;
            assetRequestQueueTimer.start();
        }
    }

    function sendPropToServer(prop) {
        if (prop.width != 44 || prop.height != 44 ||
            // have to allow standard props to extend a little bit beyond
            // the allowed boundaries, because of props created in old
            // versions of PalaceChat, and the old Mac Palace client.
            prop.verticalOffset > 88 || prop.verticalOffset < -44 ||
            prop.horizontalOffset > 88 || prop.horizontalOffset < -44) {
            // web service big prop... ignore request.
            return;
        }

        var assetResponse = prop.assetData(socket.endian);
        socket.writeInt(OutgoingMessageTypes.ASSET_REGI);
        socket.writeInt(assetResponse.length);
        socket.writeInt(0);

        socket.writeBytes(assetResponse);
    }

    function getCurrentUser() {
        return currentRoom.getUserById(id);
    }

    function updateUserProps() {
        if (!connected) {
            return;
        }
        var user = currentUser;
        var numProps = Math.min(user.props.length, 9);
        socket.writeInt(OutgoingMessageTypes.USER_PROP);
        // size -- 8 bytes per prop, 4 bytes for number of props
        socket.writeInt(user.props.length * 8 + 4);
        socket.writeInt(id);
        socket.writeInt(user.props.length);
        for (var i = 0; i < numProps; i ++) {
            var prop = PalaceProp(user.props.getItemAt(i));
            socket.writeInt(prop.asset.id);
            //socket.writeUnsignedInt(prop.asset.crc);
            socket.writeUnsignedInt(0);
        }
        socket.flush();
    }



    // ***************************************************************
    // Begin private functions to messages from the server
    // ***************************************************************

    function onConnect(event) {
        //PalaceSoundPlayer.getInstance().playConnectionPing();
        connected = true;
        state = STATE_HANDSHAKING;
        trace("Connected");
    }

    function trace(text) {
        console.log(text);
    }

    function onClose(event) {
        trace("Disconnected");
        onSocketData();
        connected = false;
        disconnect();
        dispatchEvent(new PalaceEvent(PalaceEvent.DISCONNECTED));
        //Alert.show("Connection to server lost.");
    }

    function onSocketData(buffer) {
		trace("Got data: " + buffer.length + " bytes available");
        var size;
        var p;

//			try {

            while (buffer.length > 0) {

                if (state == STATE_HANDSHAKING) {
                    handshake(buffer);
                }
                else if (state == STATE_READY) {
                    if (messageID == 0) {
                        if (buffer.length >= 12) { // Header is 12 bytes
                            messageID = buffer.readInt32LE(0);
                            messageSize = buffer.readInt32LE(0);
                            messageP = buffer.readInt32LE(0);
                        }
                        else {
                            return;
                        }
                    }
                    size = messageSize;
                    p = messageP;

                    if (size > buffer.length) {
                        return;
                    }
                    console.log(messageID);

                    switch (messageID) {
                        case IncomingMessageTypes.ALTERNATE_LOGON_REPLY:
                            alternateLogon(size, p);
                            break;

                        case IncomingMessageTypes.SERVER_DOWN:
                            handleServerDown(size, p);
                            break;

                        case IncomingMessageTypes.SERVER_VERSION:
                            handleReceiveServerVersion(size, p);
                            break;

                        case IncomingMessageTypes.SERVER_INFO:
                            handleReceiveServerInfo(size, p);
                            break;

                        case IncomingMessageTypes.USER_STATUS:
                            handleReceiveUserStatus(size, p);
                            break;

                        case IncomingMessageTypes.USER_LOGGED_ON_AND_MAX:
                            handleReceiveUserLog(size, p);
                            break;

                        case IncomingMessageTypes.GOT_HTTP_SERVER_LOCATION:
                            handleReceiveMediaServer(size, p);
                            break;

                        case IncomingMessageTypes.GOT_ROOM_DESCRIPTION:
                        case IncomingMessageTypes.GOT_ROOM_DESCRIPTION_ALT:
                            handleReceiveRoomDescription(size, p);
                            break;

                        case IncomingMessageTypes.GOT_USER_LIST:
                            handleReceiveUserList(size, p);
                            break;

                        case IncomingMessageTypes.GOT_REPLY_OF_ALL_USERS:
                            handleReceiveFullUserList(size, p);
                            break;

                        case IncomingMessageTypes.GOT_ROOM_LIST:
                            handleReceiveRoomList(size, p);
                            break;

                        case IncomingMessageTypes.ROOM_DESCEND: // No idea...
                            handleReceiveRoomDescend(size, p);
                            break;

                        case IncomingMessageTypes.USER_NEW:
                            handleUserNew(size, p);
                            break;

                        case IncomingMessageTypes.PINGED:
                            handlePing(size, p);
                            break;

                        case IncomingMessageTypes.XTALK:
                            handleReceiveXTalk(size, p);
                            break;

                        case IncomingMessageTypes.XWHISPER:
                            handleReceiveXWhisper(size, p);
                            break;

                        case IncomingMessageTypes.TALK:
                            handleReceiveTalk(size, p);
                            break;

                        case IncomingMessageTypes.WHISPER:
                            handleReceiveWhisper(size, p);
                            break;

                        case IncomingMessageTypes.ASSET_INCOMING:
                            handleReceiveAsset(size, p);
                            break;

                        case IncomingMessageTypes.ASSET_QUERY:
                            handleAssetQuery(size, p);
                            break;

                        case IncomingMessageTypes.MOVEMENT:
                            handleMovement(size, p);
                            break;

                        case IncomingMessageTypes.USER_COLOR:
                            handleUserColor(size, p);
                            break;

                        case IncomingMessageTypes.USER_FACE:
                            handleUserFace(size, p);
                            break;

                        case IncomingMessageTypes.USER_PROP:
                            handleUserProp(size, p);
                            break;
                        case IncomingMessageTypes.USER_DESCRIPTION: // (prop)
                            handleUserDescription(size, p);
                            break;
//
//						case IncomingMessage.USER_PROP:
//							handleUserProp(size, p);
//							break;

                        case IncomingMessageTypes.USER_RENAME:
                            handleUserRename(size, p);
                            break;

                        case IncomingMessageTypes.USER_LEAVING:
                            handleUserLeaving(size, p);
                            break;

                        case IncomingMessageTypes.USER_EXIT_ROOM:
                            handleUserExitRoom(size, p);
                            break;

                        case IncomingMessageTypes.PROP_MOVE:
                            handlePropMove(size, p);
                            break;

                        case IncomingMessageTypes.PROP_DELETE:
                            handlePropDelete(size, p);
                            break;

                        case IncomingMessageTypes.PROP_NEW:
                            handlePropNew(size, p);
                            break;

                        case IncomingMessageTypes.DOOR_LOCK:
                            handleDoorLock(size, p);
                            break;

                        case IncomingMessageTypes.DOOR_UNLOCK:
                            handleDoorUnlock(size, p);
                            break;

                        case IncomingMessageTypes.PICT_MOVE:
                            handlePictMove(size, p);
                            break;

                        case IncomingMessageTypes.SPOT_STATE:
                            handleSpotState(size, p);
                            break;

                        case IncomingMessageTypes.SPOT_MOVE:
                            handleSpotMove(size, p);
                            break;
                        case IncomingMessageTypes.DRAW_CMD:
                            handleDrawCommand(size, p);
                            break;
//						case IncomingMessage.CONNECTION_DIED:
//							handleConnectionDied(size, p);
//							break;
//
//						case IncomingMessage.INCOMING_FILE:
//							handleIncomingFile(size, p);
//							break;

                        case IncomingMessageTypes.NAV_ERROR:
                            handleNavError(size, p);
                            break;

                        case IncomingMessageTypes.AUTHENTICATE:
                            handleAuthenticate(size, p);
                            break;

                        case IncomingMessageTypes.BLOWTHRU:
                            trace("Blowthru message.");
                            // fall through to default...
                        default:
                            trace("Unhandled MessageID: " + messageID.toString('ascii') + " (" + messageID.toString('hex') + ") - " +
                                  "Size: " + size + " - referenceId: " + p);
                            var dataToDump = [];
                            for (var i = 0; i < size; i++) {
                                dataToDump[i] = buffer.readUnsignedByte();
                            }
                            outputHexView(dataToDump);
                            //_throwAwayData(size, p);
                            break;
                    }
                    messageID = 0;
                }
            }
//			}	
//			catch (error:EOFError) {
//				Alert.show("There was a problem reading data from the server.  You have been disconnected.");
//				disconnect();
//			}		

    }

    function onIOError(event) {
        trace("IO Error!");
        if (connecting) {
            var e = new PalaceEvent(PalaceEvent.CONNECT_FAILED);
            e.text = "Unable to connect to " + host + ":" + port + ".\n(" + event.text + ")"
            dispatchEvent(e);
        }
    }

    function onSecurityError(event) {
        trace("Security Error!");
        if (connecting) {
            connecting = false;
            disconnect();
            var securityEvent = new PalaceSecurityErrorEvent(PalaceSecurityErrorEvent.SECURITY_ERROR);
            dispatchEvent(securityEvent);
        }
    }

    // Handshake
    function handshake(buffer) {
        var messageID;
        var size;
        var p;
        var messageBuffer = getBufferCopy(buffer)

        messageID = buffer.readUInt32LE(0);
        trace(buffer.toString('hex'));
        buffer = buffer.slice(4);
        trace(buffer.toString('hex'));
        console.log(messageBuffer.toString('ascii',0,4));

        switch (messageID) {
            case IncomingMessageTypes.UNKNOWN_SERVER: //1886610802
                Alert.show("Got MSG_TROPSER.  Don't know how to proceed.","Logon Error");
                break;
            case IncomingMessageTypes.LITTLE_ENDIAN_SERVER: // MSG_DIYIT
                socket.endian = "littleEndian";
                size = buffer.readInt();
                p = buffer.readInt();
                logOn(size, p);
                break;
            case IncomingMessageTypes.BIG_ENDIAN_SERVER: // MSG_TIYID
                socket.endian = "bigEndian";
                trace(buffer.toString('hex'));
                size = buffer.readInt();
                trace(buffer.toString('hex'));
                p = buffer.readInt();
                trace(buffer.toString('hex'));
                logOn(size, p);
                break;
            default:
                trace("Unexpected MessageID while logging on: " + messageBuffer.toString('ascii',0,4));
                break;
        }
    }

    function getBufferCopy(buffer){
        var bufferCopy = new Buffer(buffer.length);
        buffer.copy(bufferCopy);
        return bufferCopy;
    }

    // Server Op Handlers
    function logOn(size, referenceId) {
        var i;

    	trace("Logging on.  a: " + size + " - b: " + referenceId);
        // a is validation
        currentRoom.selfUserId = id = referenceId;


        // LOGON
        socket.writeInt(OutgoingMessageTypes.LOGON);
        socket.writeInt(128); // struct AuxRegistrationRec is 128 bytes
        socket.writeInt(0); // RefNum unused in LOGON message

        // regCode crc
        socket.writeInt(regCRC);  // Guest regCode crc

        // regCode counter
        socket.writeInt(regCounter);  // Guest regCode counter

        // Username has to be Windows-1252 and up to 31 characters
        if (userName.length > 31) {
            userName = userName.slice(0,31);
        }
        socket.writeByte(userName.length);
        socket.writeMultiByte(userName, 'Windows-1252');
        i = 31 - (userName.length);
        for(; i > 0; i--) {
            socket.writeByte(0);
        }

        for (i=0; i < 32; i ++) {
            socket.writeByte(0);
        }

        // auxFlags
        socket.writeInt(AUXFLAGS_AUTHENTICATE | AUXFLAGS_WIN32);

        // puidCtr
        socket.writeInt(puidCounter);

        // puidCRC
        socket.writeInt(puidCRC);

        // demoElapsed - no longer used
        socket.writeInt(0);

        // totalElapsed - no longer used
        socket.writeInt(0);

        // demoLimit - no longer used
        socket.writeInt(0);

        // desired room id
        socket.writeShort(initialRoom);

        // Protocol spec lists these as reserved, and says there shouldn't
        // be anything put in them... but the server records these 6 bytes
        // in the log file.  So I'll exploit that.
        socket.writeMultiByte("OPNPAL", "iso-8859-1");

        // ulRequestedProtocolVersion -- ignored on server
        socket.writeInt(0);

        // ulUploadCaps
        socket.writeInt(
            ULCAPS_ASSETS_PALACE  // This is a lie... for now
        );

        // ulDownloadCaps
        // We have to lie about our capabilities so that servers don't
        // reject OpenPalace as a Hacked client.
        socket.writeInt(
            DLCAPS_ASSETS_PALACE |
            DLCAPS_FILES_PALACE |  // This is a lie...
            DLCAPS_FILES_HTTPSRVR
        );

        // ul2DEngineCaps -- Unused
        socket.writeInt(0);

        // ul2dGraphicsCaps -- Unused
        socket.writeInt(0);

        // ul3DEngineCaps -- Unused
        socket.writeInt(0);

        socket.flush();

        state = STATE_READY;
        connecting = false;
        dispatchEvent(new PalaceEvent(PalaceEvent.CONNECT_COMPLETE));
    }


    // not fully implemented
    // This is only sent when the server is running in "guests-are-members" mode.
    function alternateLogon(size, referenceId) {
        // This is pointless... it's basically echoing back the logon packet
        // that we sent to the server.
        // the only reason we support this is so that certain silly servers
        // can change our puid and ask us to reconnect "for security
        // reasons"

         var crc = socket.readUnsignedInt();
         var counter = socket.readUnsignedInt();
         var userNameLength = socket.readUnsignedByte();

         var userName = socket.readMultiByte(userNameLength, 'Windows-1252');
         for (var i = 0; i<31-userNameLength; i++) {
            socket.readByte(); // padding on the end of the username
         }
         for (i=0; i<32; i++) {
            socket.readByte(); // wiz password field
         }
         var auxFlags = socket.readUnsignedInt();
         var puidCtr = socket.readUnsignedInt();
         var puidCRC = socket.readUnsignedInt();
         var demoElapsed = socket.readUnsignedInt();
         var totalElapsed = socket.readUnsignedInt();
         var demoLimit = socket.readUnsignedInt();
         var desiredRoom = socket.readShort();
         var reserved = socket.readMultiByte(6,'iso-8859-1');
         var ulRequestedProtocolVersion = socket.readUnsignedInt();
         var ulUploadCaps = socket.readUnsignedInt();
         var ulDownloadCaps = socket.readUnsignedInt();
         var ul2DEngineCaps = socket.readUnsignedInt();
         var ul2DGraphicsCaps = socket.readUnsignedInt();
         var ul3DEngineCaps = socket.readUnsignedInt();

         if (puidCtr != this.puidCounter || puidCRC != this.puidCRC) {
            trace("PUID Changed by server");
            this.puidCRC = puidCRC;
            this.puidCounter = puidCtr;
            puidChanged = true;
         }
    }

    function handleReceiveServerVersion(size, referenceId) {
        version = referenceId;
        trace("Server version: " + referenceId);
    }

    function handleReceiveServerInfo(size, referenceId) {
        serverInfo = new PalaceServerInfo();
        serverInfo.permissions = socket.readInt();
        var size = Math.abs(socket.readByte());
        serverName = serverInfo.name = socket.readMultiByte(size, 'Windows-1252');

        // Weird -- this message is supposed to include options,
        // and upload/download capabilities, but doesn't.
//			serverInfo.options = socket.readUnsignedInt();
//			serverInfo.uploadCapabilities = socket.readUnsignedInt();
//			serverInfo.downloadCapabilities = socket.readUnsignedInt();
//			trace("Server name: " + serverName);
    }

    function handleAuthenticate(size, referenceId) {
//			trace("Authentication requested.");
        dispatchEvent(new PalaceEvent(PalaceEvent.AUTHENTICATION_REQUESTED));
    }

    // not fully implemented
    function handleReceiveUserStatus(size, referenceId) {
        if (currentUser) {
            currentUser.flags = socket.readShort();
        }
        else {
            temporaryUserFlags = socket.readShort();
        }
        var array = [];
        var bytesRemaining = size - 2;
        for (var i = 0; i < bytesRemaining; i ++) {
            array.push(socket.readUnsignedByte());
        }
        dispatchEvent(new Event('currentUserChanged'));
        trace("Interesting... there is more to the user status message than just the documented flags:");
        outputHexView(array)
    }

    //class c2
    function handleReceiveUserLog(size, referenceId) {
        population = socket.readInt();
        recentLogonUserIds.addItem(referenceId);
        var timer = new Timer(15000, 1);
        timer.addEventListener(TimerEvent.TIMER, function(event) {
            var index = recentLogonUserIds.getItemIndex(referenceId);
            if (index != -1) {
                recentLogonUserIds.removeItemAt(index);
            }
        });
        timer.start();
//			trace("User ID: " + referenceId + " just logged on.  Population: " + population);
    }

    function handleReceiveMediaServer(size, referenceId) {
        mediaServer = socket.readMultiByte(size, 'Windows-1252');
//			trace("Got media server: " + mediaServer);
    }

    function outputHexView(bytes) {
        var output = "";
        var outputLineHex = "";
        var outputLineAscii = "";
        for (var byteNum = 0; byteNum < bytes.length; byteNum++) {
            var hexNum = uint(bytes[byteNum]).toString(16).toUpperCase();
            if (hexNum.length == 1) {
                hexNum = "0" + hexNum;
            }

            if (byteNum % 16 == 0) {
                output = output.concat(outputLineHex, "      ", outputLineAscii, "\n");
                outputLineHex = "";
                outputLineAscii = "";
            }
            else if (byteNum % 4 == 0) {
                outputLineHex = outputLineHex.concat("  ");
                outputLineAscii = outputLineAscii.concat(" ");
            }
            else {
                outputLineHex = outputLineHex.concat(" ");
            }
            outputLineHex = outputLineHex.concat(hexNum);
            outputLineAscii = outputLineAscii.concat(
                (bytes[byteNum] >= 32 && bytes[byteNum] <= 126) ? String.fromCharCode(bytes[byteNum]) : " "
            );
        }

        var bufferLength = 57 - outputLineHex.length;
        var bufferString = "";
        for (var i = 0; i < bufferLength; i ++) {
            bufferString += " ";
        }

        output = output.concat(outputLineHex, bufferString, outputLineAscii, "\n");
        trace(output);
    }

    function readMessage(size) {
        var ba = new ByteArray();
        ba.endian = socket.endian;
        socket.readBytes(ba, 0, size);
        return ba;
    }

    function handleNavError(size, referenceId) {
        var navError = new NavErrorMessage();
        navError.read(readMessage(size), referenceId);
        var reason = "unknown reason";
        switch (navError.errorCode) {
            case NavErrorMessage.INTERNAL_ERROR:
                reason = "internal error";
                break;
            case NavErrorMessage.ROOM_UNKNOWN:
                reason = "unknown room";
                break;
            case NavErrorMessage.ROOM_FULL:
                reason = "room is full";
                break;
            case NavErrorMessage.ROOM_CLOSED:
                reason = "room is closed";
                break;
            case NavErrorMessage.CANT_AUTHOR:
                reason = "you can't author";
                break;
            case NavErrorMessage.PALACE_FULL:
                reason = "palace is full";
        }
        currentRoom.statusMessage("Denied by server.");
    }

    function handleReceiveRoomDescription(size, referenceId) {
        currentRoom.clearStatusMessage();
        palaceController.clearAlarms();
        palaceController.midiStop();

        var messageBytes = new ByteArray();
        messageBytes.endian = socket.endian;
        socket.readBytes(messageBytes, 0, size);

        // FIXME: modularize this... but for now we don't need to decode
        // everything twice.
//			var roomDescription:RoomDescription = new RoomDescription();
//			roomDescription.read(messageBytes, referenceId);

        messageBytes.position = 0;

        var roomFlags = messageBytes.readInt();
        var face = messageBytes.readInt();
        var roomID = messageBytes.readShort();
        currentRoom.id = roomID;
        var roomNameOffset = messageBytes.readShort();
        var imageNameOffset = messageBytes.readShort();
        var artistNameOffset = messageBytes.readShort();
        var passwordOffset = messageBytes.readShort();
        var hotSpotCount = messageBytes.readShort();
        var hotSpotOffset = messageBytes.readShort();
        var imageCount = messageBytes.readShort();
        var imageOffset = messageBytes.readShort();
        var drawCommandsCount = messageBytes.readShort();
        var firstDrawCommand = messageBytes.readShort();
        var peopleCount = messageBytes.readShort();
        var loosePropCount = messageBytes.readShort();
        var firstLooseProp = messageBytes.readShort();
        messageBytes.readShort();
        var roomDataLength = messageBytes.readShort();
        var rb = new Array(roomDataLength);

//			trace("Reading in room description: " + roomDataLength + " bytes to read.");
        for (var i = 0; i < roomDataLength; i++) {
            rb[i] = messageBytes.readUnsignedByte();
        }

        //outputHexView(roomBytes);

        var padding = size - roomDataLength - 40;
        for (i=0; i < padding; i++) {
            messageBytes.readByte();
        }

        var byte;

        // Room Name
        var roomNameLength = rb[roomNameOffset];
        var roomName = "";
        var ba = new ByteArray();
        for (i=0; i < roomNameLength; i++) {
            byte = rb[i+roomNameOffset+1];
            ba.writeByte(byte);
        }
        ba.position = 0;
        roomName = ba.readMultiByte(roomNameLength, 'Windows-1252');

        // Image Name
        var imageNameLength = rb[imageNameOffset];
        var imageName = "";
        for (i=0; i < imageNameLength; i++) {
            byte = rb[i+imageNameOffset+1];
            imageName += String.fromCharCode(byte);
        }
        if (PalaceConfig.URIEncodeImageNames) {
            imageName = URI.escapeChars(imageName);
        }

        // Images
        var images = {};
        currentRoom.clearSpotImages();
        for (i=0; i < imageCount; i++) {
            var imageOverlay = new PalaceImageOverlay();
            imageOverlay.addEventListener(PalaceSecurityErrorEvent.SECURITY_ERROR, handleImageOverlaySecurityError);
            imageOverlay.mediaServer = mediaServer;
            var imageBA = new ByteArray();
            for (var j=imageOffset; j < imageOffset+12; j++) {
                imageBA.writeByte(rb[j]);
            }
            imageBA.endian = socket.endian;
            imageBA.position = 0;
            imageOverlay.refCon = imageBA.readInt(); // appears unused
            imageOverlay.id = imageBA.readShort();
            var picNameOffset = imageBA.readShort(); // pstring offset
            imageOverlay.transparencyIndex = imageBA.readShort();
//				trace("Transparency Index: " + imageOverlay.transparencyIndex);
            imageBA.readShort(); // Reserved.  Padding.. field alignment
            var picNameLength = rb[picNameOffset];
            var picName = "";
            for (j=0; j < picNameLength; j++) {
                var imageNameByte = rb[picNameOffset+j+1];
                picName += String.fromCharCode(imageNameByte);
            }
            if (PalaceConfig.URIEncodeImageNames) {
                picName = URI.escapeChars(picName);
            }
            imageOverlay.filename = picName;
            images[imageOverlay.id] = imageOverlay;
            currentRoom.addSpotImage(imageOverlay);
            imageOverlay.loadImage();
//				trace("picture id: " + imageOverlay.id + " - Name: " + imageOverlay.filename);
            imageOffset += 12;
        }
        currentRoom.images = images;

        // Hotspots
        currentRoom.hotSpots.removeAll();
        currentRoom.hotSpotsAboveAvatars.removeAll();
        currentRoom.hotSpotsAboveEverything.removeAll();
        currentRoom.hotSpotsAboveNametags.removeAll();
        currentRoom.hotSpotsAboveNothing.removeAll();

        currentRoom.hotSpotsById = {};
        for (i=0; i < hotSpotCount; i++) {
            var hs = new PalaceHotspot();
            hs.readData(socket.endian, rb, hotSpotOffset);
            hotSpotOffset += hs.size;

            if (hs.layerAboveAvatars) {
                currentRoom.hotSpotsAboveAvatars.addItem(hs);
            }
            else if (hs.layerAboveNameTags) {
                currentRoom.hotSpotsAboveNametags.addItem(hs);
            }
            else if (hs.layerAboveAll) {
                currentRoom.hotSpotsAboveEverything.addItem(hs);
            }
            else {
                currentRoom.hotSpotsAboveNothing.addItem(hs);
            }

            currentRoom.hotSpots.addItem(hs);

            if (currentRoom.hotSpotsById[hs.id] == null) {
                currentRoom.hotSpotsById[hs.id] = hs;
            }
            else {
                currentRoom.logScript("WARNING: There is more than one hotspot in this room with spot id " + hs.id + "!");
            }
        }

        // Loose Props
        currentRoom.looseProps.removeAll();
        var tempPropArray = [];
        var propOffset = firstLooseProp;
        currentRoom.clearLooseProps();
        for (i=0; i < loosePropCount; i++) {
            var looseProp = new PalaceLooseProp();
            looseProp.loadData(socket.endian, rb, propOffset);
            propOffset = looseProp.nextOffset;
            currentRoom.addLooseProp(looseProp.id, looseProp.crc, looseProp.x, looseProp.y, true);
        }

        // Draw Commands
        currentRoom.drawFrontCommands.removeAll();
        currentRoom.drawBackCommands.removeAll();
        var drawCommandOffset = firstDrawCommand;
        for (i=0; i < drawCommandsCount; i++) {
            var drawRecord = new PalaceDrawRecord();
            drawRecord.readData(socket.endian, rb, drawCommandOffset);
            drawCommandOffset = drawRecord.nextOffset;
            if (drawRecord.layer == PalaceDrawRecord.LAYER_FRONT) {
//					trace("Draw front layer command at offset: " + drawCommandOffset);
                currentRoom.drawFrontCommands.addItem(drawRecord);
                currentRoom.drawLayerHistory.push(PalaceDrawRecord.LAYER_FRONT);
            }
            else{
//					trace("Draw back layer command at offset: " + drawCommandOffset);
                currentRoom.drawBackCommands.addItem(drawRecord);
                currentRoom.drawLayerHistory.push(PalaceDrawRecord.LAYER_BACK);
            }

        }

        currentRoom.backgroundFile = imageName;
//			trace("Background Image: " + currentRoom.backgroundFile);

        currentRoom.name = roomName;
//			trace("Room name: " + currentRoom.name);

        debugData = new DebugData(currentRoom);

        currentRoom.dimRoom(100);
        currentRoom.showAvatars = true;

        var roomChangeEvent = new PalaceEvent(PalaceEvent.ROOM_CHANGED);
        dispatchEvent(roomChangeEvent);
    }

    function handleImageOverlaySecurityError(error) {
        disconnect();
        var securityEvent = new PalaceSecurityErrorEvent(PalaceSecurityErrorEvent.SECURITY_ERROR);
        dispatchEvent(securityEvent);
    }

    function handleDrawCommand(size, referenceId) {

        var pBytes = [];
        for (var i = 0; i < size; i++) {
            pBytes[i] = socket.readUnsignedByte();
        }

        var drawRecord = new PalaceDrawRecord();
        drawRecord.readData(socket.endian, pBytes, 0);


        if (drawRecord.command == PalaceDrawRecord.CMD_DELETE) {
            //undo
            if (currentRoom.drawFrontCommands.length == 0 &&
                currentRoom.drawBackCommands.length == 0) {
                return;
            }
            if (currentRoom.drawLayerHistory.pop() == PalaceDrawRecord.LAYER_FRONT) {
                currentRoom.drawFrontCommands.removeItemAt(currentRoom.drawFrontCommands.length-1);
            }
            else {
                currentRoom.drawBackCommands.removeItemAt(currentRoom.drawBackCommands.length-1);
            }
            return;
        }
        else if (drawRecord.command == PalaceDrawRecord.CMD_DETONATE) {
            //delete all
            currentRoom.drawFrontCommands.removeAll();
            currentRoom.drawBackCommands.removeAll();
            currentRoom.drawLayerHistory = {};
            return;
        }

        var drawCommandOffset = drawRecord.nextOffset;

        if (drawRecord.layer == PalaceDrawRecord.LAYER_FRONT) {
            currentRoom.drawFrontCommands.addItem(drawRecord);
            currentRoom.drawLayerHistory.push(PalaceDrawRecord.LAYER_FRONT);
        }
        else {
            currentRoom.drawBackCommands.addItem(drawRecord);
            currentRoom.drawLayerHistory.push(PalaceDrawRecord.LAYER_BACK);
        }
    }

    // List of users in current room
    function handleReceiveUserList(size, referenceId) {
        // referenceId is count
        currentRoom.removeAllUsers();

        for(var i = 0; i < referenceId; i++){
            var userId = socket.readInt();
            var y = socket.readShort();
            var x = socket.readShort();
            var propIds = []; // 9 slots
            var propCrcs = []; // 9 slots

            // props
            var i1 = 0;
            do {
                propIds[i1] = socket.readInt();
                propCrcs[i1] = socket.readInt();
            }
            while (++i1 < 9);

            var roomId = socket.readShort(); // room
            var face = socket.readShort(); // face
            var color = socket.readShort(); // color
            socket.readShort(); // 0?
            socket.readShort(); // 0?
            var propnum = socket.readShort(); // number of props
            if(propnum < 9) {
                propIds[propnum] = propCrcs[propnum] = 0;
            }
            var userNameLength = socket.readByte();
            var userName = socket.readMultiByte(userNameLength, 'Windows-1252'); // Length = 32
            socket.readMultiByte(31-userNameLength, 'Windows-1252');

            var user = new PalaceUser();
            user.isSelf = Boolean(userId == id);
            user.id = userId;
            user.name = userName;
            user.propCount = propnum;
            user.x = x;
            user.y = y;
            user.propIds = propIds;
            user.propCrcs = propCrcs;
            user.face = face;
            user.color = color;
            user.loadProps();

            currentRoom.addUser(user);
        }
//			trace("Got list of users in room.  Count: " + currentRoom.users.length);
    }

    function handleReceiveRoomList(size, referenceId) {
        var numAdded = 0;
        var roomCount = referenceId;
        roomList.removeAll();
        for (var i = 0; i < roomCount; i++) {
            var room = new PalaceRoom();
            room.id = socket.readInt();
            room.flags = socket.readShort();
            room.userCount = socket.readShort();
            var length = socket.readByte();
            var paddedLength = (length + (4 - (length & 3))) - 1;
            room.name = socket.readMultiByte(paddedLength, 'Windows-1252');
            roomList.addItem(room);
            roomById[room.id] = room;
        }
//			trace("There are " + roomCount + " rooms in this palace.");
    }

    function handleReceiveFullUserList(size, referenceId) {
        userList.removeAll();
        var userCount = referenceId;
        for (var i = 0; i < userCount; i++) {
            var user = new PalaceUser();
            user.id = socket.readInt();
            user.isSelf = Boolean(user.id == id);
            user.flags = socket.readShort();
            user.roomID = socket.readShort();
            if (roomById[user.roomID]) {
                user.roomName = roomById[user.roomID].name;
            }
            else {
                user.roomName = "(Unknown Room)";
            }
            var userNameLength = socket.readByte();
            var userNamePaddedLength = (userNameLength + (4 - (userNameLength & 3))) - 1;
// Can't support UTF-8 usernames yet				
//				if (utf8) {
//					user.name = socket.readUTFBytes(userNamePaddedLength);
//				}
//				else {
                user.name = socket.readMultiByte(userNamePaddedLength, 'Windows-1252');
//				}
            //trace("User List - got user: " + user.name);
            userList.addItem(user);
        }
//			trace("There are " + userList.length + " users in this palace.");
    }

    function handleReceiveRoomDescend(size, referenceId) {
        // We're done receiving room description & user list
    }

    function handleUserNew(size, referenceId) {
        var userId = socket.readInt();
        if (recentLogonUserIds.getItemIndex(userId) != -1) {
            // Recently logged on user.
            var index = recentLogonUserIds.getItemIndex(userId);
            if (index != -1) {
                recentLogonUserIds.removeItemAt(index);
            }
            PalaceSoundPlayer.getInstance().playConnectionPing();
        }
        var y = socket.readShort();
        var x = socket.readShort();
        var propIds = []; // Props, 9 slots
        var propCrcs = []; // Prop Checksums, 9 slots

        var i1 = 0;
        do {
            propIds[i1] = socket.readInt();
            propCrcs[i1] = socket.readInt();
        }
        while (++i1 < 9); // props

        var roomId = socket.readShort(); //room
        var face = socket.readShort();
        var color = socket.readShort();
        socket.readShort(); // zero?
        socket.readShort(); // zero?
        var propnum = socket.readShort(); // number of props
        for (var pc = propnum; pc < 9; pc ++ ) {
            propIds[pc] = propCrcs[pc] = 0;
        }

        var userNameLength = socket.readByte();
        var userName;
// Can't support UTF-8 usernames yet.
//			if (utf8) {
//				userName = socket.readUTFBytes(userNameLength); // Length = 32
//			}
//			else {
            userName = socket.readMultiByte(userNameLength, 'Windows-1252'); // Length = 32
//			}
        socket.readMultiByte(31-userNameLength, 'Windows-1252');
        //userName = userName.substring(1);

        var user = new PalaceUser();
        user.isSelf = Boolean(userId == id);
        user.id = userId;
        user.x = x;
        user.y = y;
        user.propIds = propIds;
        user.propCrcs = propCrcs;
        user.propCount = propnum;
        user.name = userName;
        user.roomID = roomId;
        user.face = face;
        user.color = color;
        user.loadProps();

        currentRoom.addUser(user);

//			trace("User " + user.name + " entered.");

        if (user.id == id) {
            // Self entered
            // Signon handlers
            setTimeout(function() {
                if (needToRunSignonHandlers) {

                    // download the room/user lists when you first log on.
                    requestRoomList();
                    requestUserList();

                    palaceController.triggerHotspotEvents(IptEventHandler.TYPE_SIGNON);
                    needToRunSignonHandlers = false;
                }

                // Enter handlers
                palaceController.triggerHotspotEvents(IptEventHandler.TYPE_ENTER);
            }, 20);
        }
        else if (currentRoom.selectedUser && user.id == currentRoom.selectedUser.id) {
            //if user was selected in user list then entered room
            currentRoom.selectedUser = user;
        }
    }

    function handlePing(size, referenceId) {
        if (referenceId != id) {
//				trace("ID didn't match during ping, bailing");
            return;
        }

        socket.writeInt(OutgoingMessageTypes.PING_BACK);
        socket.writeInt(0);
        socket.writeInt(0);
        socket.flush();

//			trace("Pinged.");
    }

    /*
        Iptscrae event handlers have to process chat one piece at a time.
        Since iptscrae is run asynchronously, we have to wait for all event
        handlers for one chat event to complete before we process the next
        one.
    */
    function processChatQueue() {
        if (chatQueue.length > 0) {
            if (currentChatItem) {
                // Bail if the current item isn't finished yet.
                return;
            }
            var currentItem = chatQueue.shift();
            currentChatItem = currentItem;

            // These are global variables that need to persist even after
            // the last chat message has been processed, for compatibility
            // with the old Palace32 behavior.
            whochat = currentItem.whochat;
            chatstr = currentItem.chatstr;

            if (currentItem.eventHandlers) {
                for (var handler in currentItem.eventHandlers) {
                    handler.addEventListener(IptEngineEvent.FINISH, handleChatEventFinish);
                }
                palaceController.triggerHotspotEvents(
                    (currentItem.direction == PalaceChatRecord.INCHAT) ?
                        IptEventHandler.TYPE_INCHAT :
                        IptEventHandler.TYPE_OUTCHAT
                );
            }
            else {
                // If there aren't any event handlers, skip directly to
                // processing the chat.
                handleChatEventFinish();
            }
        }
    }

    function handleChatEventFinish(event) {
        if (currentChatItem) {

            if (event) {
                // If an event handler has fired, pull it from the
                // currentChatItem's list of events, and continue
                // processing the chat only after all event handlers
                // have executed.
                IptTokenList(event.target).removeEventListener(IptEngineEvent.FINISH, handleChatEventFinish);
                var listIndex = currentChatItem.eventHandlers.indexOf(IptTokenList(event.target));
                if (listIndex != -1) {
                    currentChatItem.eventHandlers.splice(listIndex, 1);
                }
                else {
                    return;
                }
                if (currentChatItem.eventHandlers.length > 0) {
                    // If there are more event handlers still to run,
                    // bail and wait for them to finish.
                    return;
                }
            }
            else if (currentChatItem.eventHandlers != null) {
                throw new Error("There are event handlers to run for this " +
                                "chat record, but processing was attempted " +
                                "without an event triggering it!");
            }

            currentChatItem.chatstr = chatstr;

            if (currentChatItem.direction == PalaceChatRecord.INCHAT) {

                if (currentChatItem.whisper) {
                    currentRoom.whisper(currentChatItem.whochat, currentChatItem.chatstr, currentChatItem.originalChatstr);
                }
                else {
                    currentRoom.chat(currentChatItem.whochat, currentChatItem.chatstr, currentChatItem.originalChatstr);
                }

            }
            else if (currentChatItem.direction == PalaceChatRecord.OUTCHAT) {

                if (currentChatItem.whisper) {
                    privateMessage(currentChatItem.chatstr, currentChatItem.whotarget);
                }
                else {
                    roomChat(currentChatItem.chatstr);
                }

            }

            currentChatItem = null;
        }

        // Keep processing the queue until it's empty.
        processChatQueue();
    }

    // Unencrypted TALK message
    function handleReceiveTalk(size, referenceId) {
        var messageBytes = new ByteArray();
        var message;
        if (utf8) {
            message = socket.readUTFBytes(size-1);
        }
        else {
            message = socket.readMultiByte(size-1, 'Windows-1252');
        }
        socket.readByte();
        if (referenceId == 0) {
            currentRoom.roomMessage(message);
//				trace("Got Room Message: " + message);
        }
        else {
            if (message.length > 0) {
                var chatRecord = new PalaceChatRecord(
                    PalaceChatRecord.INCHAT,
                    referenceId,
                    0,
                    message
                );
                chatRecord.eventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_INCHAT);
                chatQueue.push(chatRecord);
                processChatQueue();
            }
//				trace("Got talk from userID " + referenceId + ": " + message);
        }
    }

    function handleReceiveWhisper(size, referenceId) {
        var messageBytes = new ByteArray();
        var message;
        if (utf8) {
            message = socket.readUTFBytes(size-1);
        }
        else {
            message = socket.readMultiByte(size-1, 'Windows-1252');
        }
        socket.readByte();
        if (referenceId == 0) {
            currentRoom.roomWhisper(message);
//				trace("Got ESP: " + message);
        }
        else {
            if (message.length > 0) {
                var chatRecord = new PalaceChatRecord(
                    PalaceChatRecord.INCHAT,
                    referenceId,
                    0,
                    message,
                    true
                );
                chatRecord.eventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_INCHAT);
                chatQueue.push(chatRecord);
                processChatQueue();
            }
//				trace("Got whisper from userID " + referenceId + ": " + message);
        }
    }

    function handleReceiveXTalk(size, referenceId) {
        var length = socket.readShort();
//			trace("XTALK.  Size: " + size + " Length: " + length);
        var messageBytes = new ByteArray();
        socket.readBytes(messageBytes, 0, length-3); // Length field lies
        socket.readByte(); // Last byte is unnecessary?
        var message = PalaceEncryption.getInstance().decrypt(messageBytes, utf8);
        var chatRecord = new PalaceChatRecord(
            PalaceChatRecord.INCHAT,
            referenceId,
            0,
            message
        );
        chatRecord.eventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_INCHAT);
        chatQueue.push(chatRecord);
        processChatQueue();
//			trace("Got xtalk from userID " + referenceId + ": " + chatstr);
    }

    function handleReceiveXWhisper(size, referenceId) {
        var length = socket.readShort();
//			trace("XWHISPER.  Size: " + size + " Length: " + length);
        var messageBytes = new ByteArray();
        socket.readBytes(messageBytes, 0, length-3); // Length field lies.
        socket.readByte(); // Last byte is unnecessary?
        var message = PalaceEncryption.getInstance().decrypt(messageBytes, utf8);
        var chatRecord = new PalaceChatRecord(
            PalaceChatRecord.INCHAT,
            referenceId,
            0,
            message,
            true
        );
        chatRecord.eventHandlers = palaceController.getHotspotEvents(IptEventHandler.TYPE_INCHAT);
        chatQueue.push(chatRecord);
        processChatQueue();
//			trace("Got xwhisper from userID " + referenceId + ": " + chatstr);
    }

    function handleMovement(size, referenceId) {
        // a is four, b is userID
        var y = socket.readShort();
        var x = socket.readShort();
        currentRoom.moveUser(referenceId, x, y);
    }

    function handleUserColor(size, referenceId) {
        var user = currentRoom.getUserById(referenceId);
        user.color = socket.readShort();
//			trace("User " + referenceId + " changed color to " + user.color); 
    }

    function handleUserFace(size, referenceId) {
        var user = currentRoom.getUserById(referenceId);
        user.face = socket.readShort();
//			trace("User " + referenceId + " changed face to " + user.face);
    }

    function handleUserRename(size, referenceId) {
        var user = currentRoom.getUserById(referenceId);
        var userNameLength = socket.readByte();
        var userName;
// Can't support UTF-8 usernames yet
//			if (utf8) {
//				userName = socket.readUTFBytes(userNameLength);
//			}
//			else {
            userName = socket.readMultiByte(userNameLength, 'Windows-1252');
//			}
//			trace("User " + user.name + " changed their name to " + userName);
        user.name = userName;
    }

    function handleUserExitRoom(size, referenceId) {
        currentRoom.removeUserById(referenceId);
//			trace("User " + referenceId + " left the room");
    }

    function handleUserLeaving(size, referenceId) {
        population = socket.readInt();
        if (currentRoom.getUserById(referenceId) != null) {
            currentRoom.removeUserById(referenceId);
            PalaceSoundPlayer.getInstance().playConnectionPing();
        }
        //if user left room and ESP is active when they sign off
        if (currentRoom.selectedUser && currentRoom.selectedUser.id == referenceId)
        {
            currentRoom.selectedUser = null;
        }
//			trace("User " + referenceId + " logged off");
    }

    function handleAssetQuery(size, referenceId) {
        var type = socket.readInt();
        var assetId = socket.readInt();
        var assetCrc = socket.readUnsignedInt();
//			trace("Got asset request for type: " + type + ", assetId: " + assetId + ", assetCrc: " + assetCrc);
        var prop = PalacePropStore.getInstance().getProp(null, assetId, assetCrc);

        if (prop.ready) {
            sendPropToServer(prop);
        }
        else {
            prop.addEventListener(PropEvent.PROP_LOADED, handlePropReadyToSend);
        }
    }

    function handlePropReadyToSend(event) {
        sendPropToServer(event.prop);
    }

    function handleReceiveAsset(size, referenceId) {
        var assetType = socket.readInt();
        var assetId = socket.readInt();
        var assetCrc = socket.readUnsignedInt();
        var blockSize = socket.readInt();
        var blockOffset = socket.readInt();
        var blockNumber = socket.readShort();
        var blockCount = socket.readShort();
        var flags = 0;
        var assetSize = 0;
        var assetName = "";
        var data = [];
        if (blockNumber == 0) {
            flags = socket.readUnsignedInt();
            assetSize = socket.readInt();
            var nameLength = socket.readByte();
            assetName = socket.readMultiByte(nameLength, 'Windows-1252');
            for (var j = 0; j < 31-nameLength; j++) {
                socket.readByte();
            }
        }
        for (var i = 0; i < blockSize; i ++) {
            data[i] = socket.readByte();
        }
        var padding = size - (blockSize + 64);
        for (i=0; i < padding; i++) {
            socket.readByte();
        }
        var asset = new PalaceAsset();
        asset.id = assetId;
        asset.crc = assetCrc;
        asset.blockSize = blockSize;
        asset.blockCount = blockCount;
        asset.flags = flags;
        asset.blockNumber = blockNumber;
        asset.data = data;
        asset.type = assetType;
        asset.name = assetName;
//			trace("Received asset: (Type:" + asset.type.toString(16) + ") (ID:"+asset.id+") (CRC:" + asset.crc + ") (Name:" + asset.name + ")");
        if (asset.type == AssetManager.ASSET_TYPE_PROP) {
            PalacePropStore.getInstance().injectAsset(asset);
        }
    }

    function handleUserProp(size, referenceId) {
        var user = currentRoom.getUserById(referenceId);
        var propCount = socket.readInt();
        var propIds = [];
        var propCrcs = [];
        for (var i = 0; i < propCount; i++) {
            propIds[i] = socket.readUnsignedInt();
            propCrcs[i] = socket.readUnsignedInt();
        }
        user.propCount = propCount;
        user.propIds = propIds;
        user.propCrcs = propCrcs;
        user.loadProps();
    }

    function handleUserDescription(size, referenceId) {
        var user = currentRoom.getUserById(referenceId);
        user.face = socket.readShort();
        user.color = socket.readShort();
        var propCount = socket.readInt();
        var propIds = [];
        var propCrcs = [];
        for (var i = 0; i < propCount; i++) {
            propIds[i] = socket.readUnsignedInt();
            propCrcs[i] = socket.readUnsignedInt();
        }
        user.propCount = propCount;
        user.propIds = propIds;
        user.propCrcs = propCrcs;
        user.loadProps();
    }

    function handlePropMove(size, referenceId) {
        var propIndex = socket.readInt();
        var y = socket.readShort();
        var x = socket.readShort();
        currentRoom.moveLooseProp(propIndex, x, y);
    }

    function handlePropDelete(size, referenceId) {
        var propIndex = socket.readInt();
        currentRoom.removeLooseProp(propIndex);
    }

    function handlePropNew(size, referenceId) {
        var id = socket.readInt();
        var crc = socket.readUnsignedInt();
        var y = socket.readShort();
        var x = socket.readShort();
        currentRoom.addLooseProp(id, crc, x, y);
    }

    function handleDoorLock(size, referenceId) {
        var roomId = socket.readShort();
        var spotId = socket.readShort();
//			trace("Spot id " + spotId + " in room id " + roomId + " has been locked");
        if (roomId == currentRoom.id) {
            var hs = currentRoom.hotSpotsById[spotId];
            hs.changeState(1);
            palaceController.triggerHotspotEvent(hs, IptEventHandler.TYPE_LOCK);
        }
    }

    function handleDoorUnlock(size, referenceId) {
        var roomId = socket.readShort();
        var spotId = socket.readShort();
//			trace("Spot id " + spotId + " in room id " + roomId + " has been unlocked");
        if (roomId == currentRoom.id) {
            var hs = currentRoom.hotSpotsById[spotId];
            hs.changeState(0);
            palaceController.triggerHotspotEvent(hs, IptEventHandler.TYPE_UNLOCK);
        }
    }

    function handleSpotState(size, referenceId) {
        var roomId = socket.readShort();
        var spotId = socket.readShort();
        var spotState = socket.readUnsignedShort();
//			trace("Spot State Changed: Spot id " + spotId + " in room id " + roomId + " is now in state " + spotState);
        if (roomId == currentRoom.id) {
            var hs = currentRoom.hotSpotsById[spotId];
            if (hs != null) {
                hs.changeState(spotState);
            }
            else {
//					trace("Unable to access spot id " + spotId); 
            }
        }
    }


    function handlePictMove(size, referenceId) {
        var roomId = socket.readShort();
        var spotId = socket.readShort();
        var y = socket.readShort();
        var x = socket.readShort();
//			trace("Picture in HotSpot " + spotId + " in room " + roomId + " moved offset to " + x + "," + y);
        if (roomId != currentRoom.id) { return; }
        var hotSpot = currentRoom.hotSpotsById[spotId];
        if (hotSpot != null) {
            hotSpot.movePicTo(x, y);
        }
    }

    function handleSpotMove(size, referenceId) {
        var roomId = socket.readShort();
        var spotId = socket.readShort();
        var y = socket.readShort();
        var x = socket.readShort();
//			trace("Hotspot " + spotId + " in room " + roomId + " moved to " + x + "," + y);
        if (roomId != currentRoom.id) { return; }
        var hotSpot = currentRoom.hotSpotsById[spotId];
        if (hotSpot != null) {
            hotSpot.moveTo(x, y);
        }
    }


    function handleServerDown(size, referenceId) {
        var reason = "The connection to the server has been lost.";

        switch (referenceId) {
            case 4:
            case 7:
                reason = "You have been killed.";
                break;
            case 13:
                reason = "You have been kicked off this site.";
                break;
            case 11:
                reason = "Your death penalty is still active.";
                break;
            case 12:
                reason = "You are not currently allowed on this site.";
                break;
            case 6:
                reason = "Your connection was terminated due to inactivity.";
                break;
            case 3:
                reason = "Your connection was terminated due to flooding";
                break;
            case 8:
                reason = "This Palace is currently full - try again later.";
                break;
            case 14:
                reason = "Guests are not currently allowed on this site.";
                break;
            case 5:
                reason = "This Palace was shut down by its operator.  Try again later.";
                break;
            case 9:
                reason = "You have an invalid serial number.";
                break;
            case 10:
                reason = "There is another user using your serial number.";
                break;
            case 15:
                reason = "Your Free Demo has expired.";
                break;
            case 16:
                reason = socket.readMultiByte(size, 'Windows-1252');
                break;
            case 2:
                reason = "There has been a communications error.";
                break;
            default:
                break;
        }
        if (!puidChanged) {
            // Don't show the disconnection error if the server dropped us
            // just to change our puid and ask us to reconnect.
            Alert.show(reason, "Connection Dropped");
        }
        trace("Connection Dropped: " + reason + " - Code: " + referenceId);
    }

    function _throwAwayData(a, b) {
        for (var i = 0; i < a && socket.bytesAvailable > 0; i++) {
            socket.readByte();
        }
//			trace("Throwing away data.");
    }

}
module.exports = PalaceClient;

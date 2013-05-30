var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var PalaceClient = require("./PalaceClient/PalaceClient");

var PalaceEvent = require("./PalaceClient/palace/event/PalaceEvent");
var PalaceRoomEvent = require("./PalaceClient/palace/event/PalaceRoomEvent");
var ChatEvent = require("./PalaceClient/palace/event/ChatEvent");

process.on("uncaughtException", function (e) {
    console.log(e);
});




// handle normal files
var app = http.createServer(palaceHandler);
app.listen(3000);
function palaceHandler(req, res) {
    var url = req.url;
    if (url == '/') {
        url = '/index.html';
    }
    fs.readFile(__dirname + '/WebClient/' + url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error loading' + url);
            }

            res.writeHead(200);
            res.end(data);
        });
}

var appMedia = http.createServer(mediaHandler);
appMedia.listen(9990);
function mediaHandler(req, res) {
    var url = req.url;
    if (url.search(/^\/palace\/media\//) !== 0) {
        res.writeHead(404);
        res.end('file not found');
    }
    fs.readFile('/usr/local/palace' + url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error loading' + url);
            }

            res.writeHead(200);
            res.end(data);
        });
}
var appPalace = io.listen(app);
appPalace.set('log level', 1);
appPalace.sockets.on('connection', function (socket) {
    var palaceClient = null;
    socket.on('connect', function (host, port, userName) {
        palaceClient = new PalaceClient();
        palaceClient.connect(userName, host, port, 0, socket);

        palaceClient.on(PalaceEvent.CONNECT_COMPLETE, function (data) {
            socket.emit(PalaceEvent.CONNECT_COMPLETE);
            socket.emit('log', { text: 'You\'re connected to ' + host + ":" + port});
        });
        palaceClient.on(PalaceEvent.ROOM_CHANGED, function () {
            socket.emit(PalaceEvent.ROOM_CHANGED, palaceClient.currentRoom, palaceClient.get_mediaServer());
        });
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_ENTERED, function (event) {
            event.user.face = event.user.get_face();
            socket.emit(PalaceRoomEvent.USER_ENTERED, event);
        });
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_MOVED, function (event) {
            socket.emit(PalaceRoomEvent.USER_MOVED, event);
        });
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_LEFT, function (event) {
            socket.emit(PalaceRoomEvent.USER_LEFT, event);
        });
        palaceClient.currentRoom.on(ChatEvent.CHAT, function(event, message, user){
            socket.emit(ChatEvent.CHAT, event, message, user);
        });
        palaceClient.currentRoom.on(ChatEvent.WHISPER, function(event, message, user){
            socket.emit(ChatEvent.WHISPER, event, message, user);
        });

        palaceClient.currentRoom.on('faceChanged', function (user) {
            socket.emit('faceChanged', user);
        });

    });

    socket.on('chat', function (data) {
        console.log('chat');
        palaceClient.currentRoom.set_selectedUser(null);
        palaceClient.say(data.text);
    });
    socket.on('whisper', function (data) {
        var selectedUser = palaceClient.currentRoom.getUserById(data.user);
        palaceClient.currentRoom.set_selectedUser(selectedUser);
        palaceClient.say(data.text);
    });
    socket.on('userMoved', function (data) {
        palaceClient.move(data.x, data.y);
    });
    socket.on("disconnect", function () {
        palaceClient.disconnect();
    });
    socket.on("logout", function () {
        palaceClient.disconnect();
    });
});
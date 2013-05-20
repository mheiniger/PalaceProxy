var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var PalaceClient = require("./PalaceClient/PalaceClient");

var PalaceEvent = require("./PalaceClient/palace/event/PalaceEvent");
var PalaceRoomEvent = require("./PalaceClient/palace/event/PalaceRoomEvent");

process.on("uncaughtException", function (e) {
    console.log(e);
});

io.set('log level', 1);
app.listen(3000);

// handle normal files
function handler(req, res) {
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

io.sockets.on('connection', function (socket) {
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
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_ENTERED, function (user) {
            socket.emit(PalaceRoomEvent.USER_ENTERED, user);
        });
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_MOVED, function (user) {
            socket.emit(PalaceRoomEvent.USER_MOVED, user);
        });
        palaceClient.currentRoom.on(PalaceRoomEvent.USER_LEFT, function (user) {
            socket.emit(PalaceRoomEvent.USER_LEFT, user);
        });

    });

    socket.on('chat', function (data) {
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
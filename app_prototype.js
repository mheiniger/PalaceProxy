var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var PalaceClient = require("./PalaceClient/PalaceClient");

process.on("uncaughtException", function (e) {
    console.log(e);
});

if (process.argv.length != 4) {
    console.log("Require the following command line arguments:" +
        " service_host service_port");
    console.log(" e.g. localhost 9998");
    process.exit();
}





var serverHost = process.argv[2];
var serverPort = process.argv[3];

app.listen(3000);

function handler (req, res) {
    var url = req.url;
    if(url == '/'){
       url = '/index.html';
    }
    fs.readFile(__dirname + '/WebClient/' + url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading' + url);
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) {
    var palaceClient = new PalaceClient();
    palaceClient.connect("TestUser", serverHost, serverPort, 0, socket);
    socket.emit('log', { text: 'You\'re connected to ' + serverHost + ":" + serverPort});
    socket.on('text entered', function (data) {
        console.log(data.text);
        socket.emit('log', { text: 'you sent: ' + data.text });
        palaceClient.say(data.text);
    });
});


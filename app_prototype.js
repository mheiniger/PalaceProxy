var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
var fs = require('fs')

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
    socket.emit('log', { text: 'You\'re connected' });
    socket.on('text entered', function (data) {
        console.log(data.text);
        socket.emit('log', { text: 'you sent: ' + data.text });
    });
});
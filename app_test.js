var util = require('util');
var net = require('net');
var fs = require('fs');
var http = require('http');
var PalaceClient = require("./PalaceClient/PalaceClient");

process.on("uncaughtException", function (e) {
    console.log(e);
});

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

if (process.argv.length != 4) {
    console.log("Require the following command line arguments:" +
        " service_host service_port");
    console.log(" e.g. localhost 9998");
    process.exit();
}

var serverHost = process.argv[2];
var serverPort = process.argv[3];

var palaceClient = PalaceClient.getInstance();


palaceClient.connect("TestUser", serverHost, serverPort, 0);



var util = require('util');
var net = require("net");
var packet = require("packet");
var PalaceClient = require("./PalaceClient/PalaceClient");

process.on("uncaughtException", function (e) {
    console.log(e);
});

if (process.argv.length != 5) {
    console.log("Require the following command line arguments:" +
        " proxy_port service_host service_port");
    console.log(" e.g. 9001 www.google.com 80");
    process.exit();
}

var proxyPort = process.argv[2];
var serverHost = process.argv[3];
var serverPort = process.argv[4];

net.createServer(function (clientSocket) {
    var connected = false;
    var loginPhase = true;
    var buffers = new Array();
//    var serverSocket = new net.Socket();
    var palaceClient = new PalaceClient();

//    serverSocket.connect(parseInt(serverPort), serverHost, function () {
//        connected = true;
//        if (buffers.length > 0) {
//            for (i = 0; i < buffers.length; i++) {
//                console.log("-" + buffers[i]);
//                serverSocket.write(buffers[i]);
//            }
//        }
//    });

    PalaceClient.connect("TestUser", serverHost, serverPort, 0);

    clientSocket.on("error", function (e) {
        serverSocket.end();
    });

    serverSocket.on("error", function (e) {
        console.log("Could not connect to service at host "
            + serverHost + ', port ' + serverPort);
        clientSocket.end();
    });

    clientSocket.on("data", function (data) {
        if (connected) {
            serverSocket.write(data);
            console.log("sending:" + data.toString().substr(0, 68));
        } else {
            buffers[buffers.length] = data;
        }
    });

    serverSocket.on("data", function (data) {
        var plainText =
        console.log("receiving:" + data.toString().substr(0, 68));
        clientSocket.write(data);
    });

    clientSocket.on("close", function (had_error) {
        serverSocket.end();
    });

    serverSocket.on("close", function (had_error) {
        clientSocket.end();
    });

}).listen(proxyPort)


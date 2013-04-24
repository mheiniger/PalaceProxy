var util = require('util');
var net = require("net");
// var packet = require("packet"); // not needed for now
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

var palaceClient = PalaceClient.getInstance();


palaceClient.connect("TestUser", serverHost, serverPort, 0);



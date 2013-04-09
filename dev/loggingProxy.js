var util = require('util');
var net = require("net");
var fs = require('fs');

process.on("uncaughtException", function(e) {
	console.log(e);
});

if (process.argv.length != 5) {
  console.log("Require the following command line arguments:" +
    " proxy_port service_host service_port");
    console.log(" e.g. 9001 www.google.com 80");
  process.exit();
}

var clientPort = process.argv[2];
var serverHost = process.argv[3];
var serverPort = process.argv[4];

net.createServer(function (clientSocket) {
  var connected = false;
  var buffers = new Array();
  var serverSocket = new net.Socket();
  var fileNumber = 0;
  var folder = "log/" + new Date().getTime() + "/";
  fs.mkdir(folder, function(){});

  serverSocket.connect(parseInt(serverPort), serverHost, function() {
    connected = true;
    if (buffers.length > 0) {
        fileNumber++;
      var writeableStream = fs.createWriteStream(folder + fileNumber + "_sent");
      for (i = 0; i < buffers.length; i++) {
        console.log(buffers[i]);
        serverSocket.write(buffers[i]);
        writeableStream.write(buffers[i]);
      }
      writeableStream.end();
    }
  });
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
        fileNumber++;
        fs.createWriteStream(folder + fileNumber + "_sent").write(data).end();
        serverSocket.write(data);
    } else {
      buffers[buffers.length] = data;
    }
  });
  serverSocket.on("data", function(data) {
      fileNumber++;
      fs.createWriteStream(folder + fileNumber + "_received").write(data).end();
      clientSocket.write(data);
  });
  clientSocket.on("close", function(had_error) {
    serverSocket.end();
  });
  serverSocket.on("close", function(had_error) {
    clientSocket.end();
  });
}).listen(clientPort)

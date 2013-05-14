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

try {
    fs.mkdirSync('log');
} catch (e) { };

net.createServer(function (clientSocket) {
  var connected = false;
  var buffers = new Array();
  var serverSocket = new net.Socket();
  var fileNumber = 0;
  var folder = "log/" + new Date().getTime() + "/";

  try {
      fs.mkdirSync(folder);
  } catch (e) { console.log('couldn\'t create folder ' + folder)};

  serverSocket.connect(parseInt(serverPort), serverHost, function() {
    connected = true;
    if (buffers.length > 0) {
        fileNumber++;
      var writeableStream = fs.createWriteStream(folder + String('00000'+fileNumber).slice(-5) + "_sent");
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
        var writeableStream_sent = fs.createWriteStream(folder + String('00000'+fileNumber).slice(-5) + "_sent");
        writeableStream_sent.end(data);
        serverSocket.write(data);
    } else {
      buffers[buffers.length] = data;
    }
  });
  serverSocket.on("data", function(data) {
      fileNumber++;
      var writeableStream_received = fs.createWriteStream(folder + String('00000'+fileNumber).slice(-5) + "_received");
      writeableStream_received.end(hexView(data));
      clientSocket.write(data);
  });
  clientSocket.on("close", function(had_error) {
    serverSocket.end();
  });
  serverSocket.on("close", function(had_error) {
    clientSocket.end();
  });
}).listen(clientPort)

function hexView(bytes) {
    var output = "";
    var outputLineHex = "";
    var outputLineAscii = "";
    for (var byteNum = 0; byteNum < bytes.length; byteNum++) {
        var hexNum = (bytes[byteNum]).toString(16).toUpperCase();
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
    for (var i = 0; i < bufferLength; i++) {
        bufferString += " ";
    }

    output = output.concat(outputLineHex, bufferString, outputLineAscii, "\n");
    return(output);
}

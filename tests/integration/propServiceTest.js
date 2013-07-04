var zlib = require('zlib');
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Encoding': 'gzip'});

    var text = "Hello World!";
    var buf = new Buffer(text, 'utf-8');   // Choose encoding for the string.
    zlib.gzip(buf, function (_, result) {  // The callback will give you the
        res.end(result);                     // result, so just send it.
    });
}).listen(80);
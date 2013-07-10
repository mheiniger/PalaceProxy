var zlib = require('zlib');
var http = require('http');

var host = "our.epalacesmedia.com";
// var host = "dream-animemedia.ipalaces.org";


var data = JSON.stringify(
    {"props": [
        {"id": -766399020},
        {"id": 1325152262},
        {"id": -552906326},
        {"id": 1606115290}
    ], "api_version": 1}
);

//var data = JSON.stringify(
//    {"props":[{"id":1215301935}],"api_version":1}
//);

var path = '/webservice/props/get';

doPropGetRequest(host, path, data, function (data) {
    console.log(data.toString('binary'));
});

function doPropGetRequest(host, path, data, callback) {

    var options = {
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'deflate'
        }
    };

    var httpRequest = http.request(options,
        function (result) {
            if (result.statusCode == 301) {
                doPropGetRequest(host, result.headers.location, data, callback);
            } else {
                result.on('data', function (data) {
                    callback(data);
                    console.log('end');
                });

                result.on('error', function (data) {
                    console.log('request-error:');
                    console.log(data);
                })
            }

        });

    httpRequest.on('error', function (err) {
        console.log(err);
    });

    var buffer = new Buffer(data, 'utf-8');
    zlib.deflate(buffer, function (_, result) {
        httpRequest.write(result);
        httpRequest.end();
    });
}
var zlib = require('zlib');
var request = require('request');


var host = "swisschat.elitepalacesmedia.com";

var data = JSON.stringify(
    {"props": [
        {"id": 2763450439}
//        {"id": 1325152262},
//        {"id": -552906326},
//        {"id": 1606115290}
    ], "api_version": 1}
);
console.log('width data: ' + data);

var buffer = new Buffer(data, 'utf-8');
zlib.deflate(buffer, function (_, result) {
    requestPropLocation('http://' + host + '/webservice/props/get', result, function(answer) {
        console.log('answer:');
        console.log(answer);
    });
});


function requestPropLocation(uri, props, callback) {
    console.log('request to: ' + uri);
    request(
        {
            method: 'POST',
            uri: uri,
            headers: {
                'User-Agent': 'PalaceChat/4.1.251 (Windows) gzip',
                'Content-Encoding': 'gzip',
                'Host': host,
                'Connection': 'close',
                'Accept-Encoding': 'gzip,deflate',
                'Content-Type': 'application/json'
            },
            followRedirect: false,
//            followAllRedirects: true,
            body: props
        }, function (error, response, body) {
//            console.log(error);
//            console.log(response.headers);
//            console.log('http code: ' + response.statusCode);
//            console.log(body);

            if (response.statusCode == 301) {
                console.log('redirecting...');
                requestPropLocation(response.headers.location, props, callback);
            } else if (response.statusCode == 200) {
                callback(body);
            }
        }
    );
}

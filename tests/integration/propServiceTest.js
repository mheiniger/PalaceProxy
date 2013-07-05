var zlib = require('zlib');
var http = require('follow-redirects').http;

var host = "dream-animemedia.ipalaces.org";

var request = http.request({
    hostname: host,
    path: '/webservice/props/get',
    method: 'POST',
    headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'application/json'
    }

}, function (res) {
    res.on('data', function (data) {
        console.log(data.toString('binary'));
        console.log('end');
    });
});

var data = JSON.stringify({
    "props": [
        {"id": 1569978199}
    ],
    "api_version": 1
});

request.on('error', function (err) {
//    handleIOError(err);
    console.log(err);
});

console.log('requesting: ' + host + '/webservice/props/get');
zlib.gzip(data, function (_, result) {  // The callback will give you the
    request.write(result);
    request.end();
});

console.log('width data: ' + data);

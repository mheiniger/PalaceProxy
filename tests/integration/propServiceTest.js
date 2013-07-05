var zlib = require('zlib');
//var http = require('follow-redirects').http;
//var http = require('http');
var request = require('request');




//var request = http.request({
//    hostname: host,
//    path: '/webservice/props/get',
//    method: 'POST',
//    headers: {
//        'Accept-Encoding': 'gzip',
//        'Content-Type': 'application/json',
//        'User-Agent': 'PalaceChat/4.1.251 (Windows) gzip',
//        'Host': 'dream-animemedia.ipalaces.org',
//        'Connection': 'close',
//        'Accept-Encoding': 'gzip,deflate'
//    }
//
//}, function (res) {
//    res.on('data', function (data) {
//        console.log(data.toString('binary'));
//        console.log('end');
//    });
//
//    res.on('error', function (data) {
//        console.log('request-error:');
//        console.log(data);
//    })
//});
//
//request.on('error', function (err) {
////    handleIOError(err);
//    console.log(err);
//});

var host = "our.epalacesmedia.com";

var data = JSON.stringify(
    {"props":[{"id":-766399020},{"id":1325152262},{"id":-552906326},{"id":1606115290}],"api_version":1}
);
console.log('width data: ' + data);

var buffer = new Buffer(data, 'utf-8');
console.log('requesting: ' + host + '/webservice/props/get');


zlib.gzip(buffer, function (_, result) {  // The callback will give you the

    request(
        {
            method: 'POST',
            uri: 'http://' + host + '/webservice/props/get/',
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
            body: result
        }, function (error, response, body) {
            console.log(error);
            console.log(response.headers);
            console.log('http code: ' + response.statusCode);
            console.log(body);
            if ('http://' + host + '/webservice/props/get' == response.headers.location){
                console.log('headers from first and second request are the same');
            } else {
                console.log('headers from first and second request are diffrent: ');
                console.log('http://' + host + '/webservice/props/get');
                console.log(response.headers.location);
            }
            //secondRequest(response.headers.location, result);
        }

    );


//    request.write(result);
//    request.end();
});

function secondRequest(uri, body) {
    console.log('second request to: ' + uri);
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
            body: body
        }, function (error, response, body) {
            console.log(error);
            console.log(response.headers);
            console.log('http code: ' + response.statusCode);
            console.log(body);
        }

    );

}

//	import com.adobe.serialization.json.JSON;

var util = require("util");
var zlib = require('zlib');
var request = require('request');
var Event = require("../../adapter/events/Event");
var EventDispatcher = require("../../adapter/events/EventDispatcher");
var IOErrorEvent = require("../../adapter/events/IOErrorEvent");
var SecurityErrorEvent = require("../../adapter/events/SecurityErrorEvent");
var URLLoader = require("../../adapter/net/URLLoader");
var URLLoaderDataFormat = require("../../adapter/net/URLLoaderDataFormat");
var URLRequest = require("../../adapter/net/URLRequest");
var URLRequestHeader = require("../../adapter/net/URLRequestHeader");
var URLRequestMethod = require("../../adapter/net/URLRequestMethod");
JSON.encode = JSON.stringify;
JSON.decode = JSON.parse;

var PalaceConfig = require("../model/PalaceConfig");
//	import net.codecomposer.palace.model.PalaceProp;
//	import net.codecomposer.palace.rpc.PalaceClient;
var OPWSParameters = require("./OPWSParameters");
var OPWSEvent = require("./OPWSEvent");

module.exports = OPWSGetProps;

// OPWS = Open Palace Web Service
util.inherits(OPWSGetProps, EventDispatcher); //extends EventDispatcher
function OPWSGetProps(palaceClient) //extends EventDispatcher
{
    OPWSGetProps.super_.call(this);
    var that = this;

    var _loader/* :URLLoader */;

    var client/* :PalaceClient */ = palaceClient;

    this.send = function (props/* :Array */)/* :void */ {
        var requestDefs/* :Array */ = [];
        var requestLegacyDefs = {};
        for (var propNr/* :PalaceProp */ in props) {
            var prop = props[propNr];
            var requestDef/* :Object */ = {};
            var requestLegacyDef/* :Object */ = {};
            if (prop.asset.guid) {
                requestDef['guid'] = prop.asset.guid;
            }
            else {
                requestDef['id'] = prop.asset.id;
                requestLegacyDefs[prop.asset.id] = {
                    id: prop.asset.id,
                    crc: prop.asset.crc,
                    originating_palace: client.host + ":" + client.port
                }
            }
            requestDefs.push(requestDef);
        }

        var data = JSON.encode({
            api_version: 1,
//            api_key: OPWSParameters.API_KEY,
            props: requestDefs
        });

        console.log('width data: ' + data);

        var buffer = new Buffer(data, 'utf-8');
        zlib.deflate(buffer, function (_, result) {
            requestPropLocation(palaceClient.get_mediaServer().replace(/\/$/gm,'') + '/webservice/props/get/', result, function(answer) {
                console.log('answer:');
                console.log(answer);
                handleComplete(answer, requestDefs, requestLegacyDefs)
            });
        });

//        var request/* :URLRequest */ = new URLRequest(palaceClient.host + "/webservice/props/get");
//        request.contentType = 'application/json';
//        request.method = URLRequestMethod.POST;
//        request.requestHeaders = [
//            new URLRequestHeader('Accept', 'application/json')
//        ];
//        request.data = JSON.encode({
//            api_version: 1,
//            api_key: OPWSParameters.API_KEY,
//            props: requestDefs
//        });
//
//        _loader = new URLLoader();
//        _loader.dataFormat = URLLoaderDataFormat.TEXT;
//        _loader.addEventListener(Event.COMPLETE, handleComplete);
//        _loader.addEventListener(IOErrorEvent.IO_ERROR, handleIOError);
//        _loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
//        _loader.load(request);
    };

    function requestPropLocation(uri, props, callback) {
        console.log('request to: ' + uri);
        request(
            {
                method: 'POST',
                uri: uri,
                headers: {
                    'User-Agent': 'PalaceChat/4.1.251 (Windows) gzip',
                    'Content-Encoding': 'gzip',
//                    'Host': host,
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
                } else if (error) {
                    handleIOError(error);
                }
            }
        );
    }

    function handleIOError(event/* :IOErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleSecurityError(event/* :SecurityErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleComplete(data, requestDefs, requestLegacyDefs)/* :void */ {
        var e/* :OPWSEvent */ = new OPWSEvent(OPWSEvent.RESULT_EVENT);
        try {
            e.result = JSON.decode(String(data));
            e.legacyDefs = requestLegacyDefs;
        }
        catch (error/* :Error */) {
            //throw new Error("Unable to decode JSON response: " + error.name + ":\n" + error.message);
            e.result.props = requestDefs;
        }
        dispatchEvent(e);
    }

    function dispatchEvent(object) {
        that.dispatchEvent(object.type, object);
    }
}

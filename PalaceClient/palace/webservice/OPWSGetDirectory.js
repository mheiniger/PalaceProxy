//	import com.adobe.serialization.json.JSON;

var util = require("util");
var http = require('follow-redirects').http;
//	import flash.events.Event;
var EventDispatcher = require("../../adapter/events/EventDispatcher");
var IOErrorEvent = require("../../adapter/events/IOErrorEvent");
var SecurityErrorEvent = require("../../adapter/events/SecurityErrorEvent");
var URLLoader = require("../../adapter/net/URLLoader");
var URLLoaderDataFormat = require("../../adapter/net/URLLoaderDataFormat");
var URLRequest = require("../../adapter/net/URLRequest");
var URLRequestHeader = require("../../adapter/net/URLRequestHeader");
var URLRequestMethod = require("../../adapter/net/URLRequestMethod");


var PalaceConfig = require("../model/PalaceConfig");
//	import net.codecomposer.palace.model.PalaceProp;
//	import net.codecomposer.palace.rpc.PalaceClient;
var OPWSEvent = require("./OPWSEvent");

module.exports = OPWSGetDirectory;

//	import net.codecomposer.palace.model.PalaceConfig;
util.inherits(OPWSGetDirectory, EventDispatcher); //extends EventDispatcher
function OPWSGetDirectory(palaceClient) //extends EventDispatcher
{
    OPWSGetDirectory.super_.call(this);
    var that = this;

    var _loader/* :URLLoader */;

    this.send = function ()/* :void */ {
        var request = http.request({
            hostname: palaceClient.host,
            path: '/webservice/directory/get?content-type=application%2Fjson',
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Accept': 'application/json'
            }

        }, function (res) {
            res.on('data', function (chunk) {
                handleComplete(chunk)
            });
        });

        request.on('error', function (err) {
            handleIOError(err);
        });

        request.end();

//        var request/* :URLRequest */ = new URLRequest(palaceClient.host + "/webservice/directory/get?content-type=application%2Fjson");
//        request.contentType = 'application/json';
//        request.method = URLRequestMethod.POST;
//        request.requestHeaders = [
//            new URLRequestHeader('Accept', 'application/json'),
//            new URLRequestHeader('Content-type', 'application/json')
//        ];
//
//        _loader = new URLLoader();
//        _loader.dataFormat = URLLoaderDataFormat.TEXT;
//        _loader.addEventListener(Event.COMPLETE, handleComplete);
//        _loader.addEventListener(IOErrorEvent.IO_ERROR, handleIOError);
//        _loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
//        _loader.load(request);
    };

    function handleIOError(event/* :IOErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleSecurityError(event/* :SecurityErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleComplete(event/* :Event */)/* :void */ {
        var e/* :OPWSEvent */ = new OPWSEvent(OPWSEvent.RESULT_EVENT);
        try {
            e.result = JSON.decode(String(_loader.data));
        }
        catch (error/* :Error */) {
            throw new Error("Unable to decode JSON response: " + error.name + ":\n" + error.message);
        }
        dispatchEvent(e);
    }

    function dispatchEvent(object) {
        that.dispatchEvent(object.type, object);
    }
}
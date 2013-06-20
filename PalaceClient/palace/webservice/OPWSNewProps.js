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
JSON.encode = JSON.stringify;
JSON.decode = JSON.parse;

var UIDUtil = require("../../adapter/utils/UIDUtil");

var PalaceConfig = require("../model/PalaceConfig");
//	import net.codecomposer.palace.model.PalaceProp;
//	import net.codecomposer.palace.rpc.PalaceClient;
var OPWSParameters = require("./OPWSParameters");
var OPWSEvent = require("./OPWSEvent");

module.exports = OPWSNewProps;

// OPWS = Open Palace Web Service
util.inherits(OPWSNewProps, EventDispatcher); //extends EventDispatcher
function OPWSNewProps(palaceClient)
{
    OPWSNewProps.super_.call(this);
    var that = this;
//		[Event(type="OPWSEvent", name="result")]
//		[Event(type="OPWSEvent", name="fault")]

    var _loader/* :URLLoader */;

    var _props/* :Array */;

    var client/* :PalaceClient */ = palaceClient;

    this.send = function (props/* :Array */)/* :void */ {
        var requestDefs/* :Array */ = [];
        for (var propNr/* :PalaceProp */ in props) {
            var prop = props[propNr];
            prop.asset.temporaryIdentifier = UIDUtil.createUID();
            var requestDef/* :Object */ = {
                legacy_identifier: {
                    id: prop.asset.id,
                    crc: prop.asset.crc,
                    originating_palace: client.host + ":" + client.port
                },
                temp_id: prop.asset.temporaryIdentifier,
                name: prop.asset.name,
                offsets: {
                    x: prop.horizontalOffset,
                    y: prop.verticalOffset
                },
                size: {
                    width: prop.width,
                    height: prop.height
                },
                flags: {
                    head: prop.head,
                    ghost: prop.ghost,
                    rare: prop.rare,
                    animate: prop.animate,
                    palindrome: prop.palindrome,
                    bounce: prop.bounce
                },
                format: prop.webServiceFormat
            };
            requestDefs.push(requestDef);
        }

        var request = http.request({
            hostname: palaceClient.host,
            path: '/webservice/props/new',
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

        var data = JSON.encode({
            api_version: 1,
            api_key: OPWSParameters.API_KEY,
            props: requestDefs
        });

        request.on('error', function (err) {
            handleIOError(err);
        });

        request.write('data\n');
        request.end();

//        var request/* :URLRequest */ = new URLRequest(palaceClient.host + "/webservice/props/new");
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

    function handleIOError(event/* :IOErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleSecurityError(event/* :SecurityErrorEvent */)/* :void */ {
        dispatchEvent(new OPWSEvent(OPWSEvent.FAULT_EVENT));
    }

    function handleComplete(data, requestDefs/* :Event */)/* :void */ {
        var e/* :OPWSEvent */ = new OPWSEvent(OPWSEvent.RESULT_EVENT);
        try {
            e.result = JSON.decode(String(data));
        }
        catch (error/* :Error */) {
//            throw new Error("Unable to decode JSON response: " + error.name + ":\n" + error.message);
            e.result.props = requestDefs;
        }
        dispatchEvent(e);
    }

    function dispatchEvent(object) {
        that.dispatchEvent(object.type, object);
    }
}
//	import com.adobe.serialization.json.JSON;
var util = require("util");

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
//	import net.codecomposer.palace.model.PalaceConfig;
//	import net.codecomposer.palace.model.PalaceProp;
var OPWSParameters = require("./OPWSParameters");
var OPWSEvent = require("./OPWSEvent");

module.exports = OPWSConfirmPropsUpload;

// OPWS = Open Palace Web Service
util.inherits(OPWSConfirmPropsUpload, EventDispatcher); //extends EventDispatcher
function OPWSConfirmPropsUpload()
{
    OPWSConfirmPropsUpload.super_.call(this);
    var that = this;

    var _loader/* :URLLoader */;

    var _props/* :Array */;

    this.send = function (props/* :Array */)/* :void */ {
        var requestDefs/* :Array */ = [];
        for (var prop/* :PalaceProp */ in props) {
            if (prop.asset.guid) {
                var requestDef/* :Object */ = {};
                requestDef['guid'] = prop.asset.guid;
                requestDefs.push(requestDef);
            }
        }
        var request/* :URLRequest */ = new URLRequest(PalaceConfig.webServiceURL + "/props/confirm_upload");
        request.contentType = 'application/json';
        request.method = URLRequestMethod.POST;
        request.requestHeaders = [
            new URLRequestHeader('Accept', 'application/json')
        ];
        request.data = JSON.encode({
            api_version: 1,
            api_key: OPWSParameters.API_KEY,
            props: requestDefs
        });

        _loader = new URLLoader();
        _loader.dataFormat = URLLoaderDataFormat.TEXT;
        _loader.addEventListener(Event.COMPLETE, handleComplete);
        _loader.addEventListener(IOErrorEvent.IO_ERROR, handleIOError);
        _loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
        _loader.load(request);
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
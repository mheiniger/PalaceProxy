var Event = require("../../adapter/events/Event");
//	import flash.events.Event;
var IOErrorEvent = require("../../adapter/events/IOErrorEvent");
var SecurityErrorEvent = require("../../adapter/events/SecurityErrorEvent");
var TimerEvent = require("../../adapter/events/TimerEvent");

var URLLoader = require("../../adapter/net/URLLoader");
var URLLoaderDataFormat = require("../../adapter/net/URLLoaderDataFormat");
var URLRequest = require("../../adapter/net/URLRequest");
var URLRequestMethod = require("../../adapter/net/URLRequestMethod");
var Timer = require("../../adapter/utils/Timer");

var PalaceConfig = require("./PalaceConfig");
var PalaceProp = require("./PalaceProp");
var PropEvent = require("../event/PropEvent");
//	import net.codecomposer.palace.rpc.PalaceClient;
var OPWSConfirmPropsUpload = require("../webservice/OPWSConfirmPropsUpload");
var OPWSEvent = require("../webservice/OPWSEvent");
var OPWSGetProps = require("../webservice/OPWSGetProps");
var OPWSNewProps = require("../webservice/OPWSNewProps");

//	import net.codecomposer.util.MultiPartFormBuilder;

module.exports = PalacePropStore;

function PalacePropStore(palaceClient) {
    var that = this;

    var props/* :Object */ = {}; //new Object();
    var propsArray/* :Array */ = [];

    var client/* :PalaceClient */ = palaceClient;

    var assetsToRequest/* :Array */ = [];
    var assetRequestTimer/* :Timer */ = new Timer(50, 1);

    var propsToUpload/* :Array */ = [];
    var propsUploadtimer/* :Timer */ = new Timer(1000, 1);

    var propsToConfirmUpload/* :Array */ = [];
    var propsUploadConfirmTimer/* :Timer */ = new Timer(1000, 1);

    this.PalacePropStoreConstructor = function () {
        assetRequestTimer.addEventListener(TimerEvent.TIMER, handleAssetRequestTimer);
        propsUploadtimer.addEventListener(TimerEvent.TIMER, handlePropsUploadTimer);
        propsUploadConfirmTimer.addEventListener(TimerEvent.TIMER, handlePropsUploadConfirmTimer);
        console.log('asset timers started');
    };
    this.PalacePropStoreConstructor();

    this.injectAsset = function (asset/* :PalaceAsset */)/* :void */ {
        var prop/* :PalaceProp */ = that.getProp(asset.guid, asset.id, asset.crc);
        prop.asset = asset;
        prop.decodeProp();
    };

    this.getProp = function (guid/* :String */, assetId/* :int =0*/, assetCrc/* :int =0*/)/* :PalaceProp */ {
        var prop/* :PalaceProp */;
        var propToDelete/* :PalaceProp */;
        if (guid) {
            prop = props[guid];
            if (prop == null) {
                prop = props[guid] = props[assetId] = new PalaceProp(guid, assetId, assetCrc);
                propsArray.push(prop);
                if (propsArray.length > PalaceConfig.numberPropsToCacheInRAM) {
                    propToDelete = propsArray.shift();
                    props[propToDelete.asset.guid] = null;
                    props[propToDelete.asset.id] = null;
                }
                that.requestAsset(prop);
            }
        }
        else {
            prop = props[assetId];
            if (prop == null) {
                prop = props[assetId] = new PalaceProp(guid, assetId, assetCrc);
                propsArray.push(prop);
                if (propsArray.length > PalaceConfig.numberPropsToCacheInRAM) {
                    propToDelete = propsArray.shift();
                    props[propToDelete.asset.guid] = null;
                    props[propToDelete.asset.id] = null;
                }
                that.requestAsset(prop);
            }
        }
        return prop;
    };

    this.requestAsset = function (prop/* :PalaceProp */)/* :void */ {
        console.log('requesting new asset');
        prop.addEventListener(PropEvent.PROP_DECODED, handlePropDecoded);
        assetsToRequest.push(prop);
        assetRequestTimer.reset();
        assetRequestTimer.start();
    };

    function handlePropDecoded(event/* :PropEvent */)/* :void */ {
        // Need to send the prop to the web service
        propsToUpload.push(event.prop);
        propsUploadtimer.reset();
        propsUploadtimer.start();
    }

    function handlePropsUploadTimer(event/* :Timer Event */)/* :void */ {
        var rpc/* :OPWSNewProps */ = new OPWSNewProps(palaceClient);
        rpc.addEventListener(OPWSEvent.RESULT_EVENT, handleNewPropsResult);
        rpc.send(propsToUpload);
        propsToUpload = [];
    }

    function confirmPropUpload(prop/* :PalaceProp */)/* :void */ {
        propsToConfirmUpload.push(prop);
        propsUploadConfirmTimer.reset();
        propsUploadConfirmTimer.start();
    }

    function handlePropsUploadConfirmTimer(event/* :Timer Event */)/* :void */ {
        var rpc/* :OPWSConfirmPropsUpload */ = new OPWSConfirmPropsUpload(palaceClient);
        rpc.addEventListener(OPWSEvent.RESULT_EVENT, handlePropsUploadConfirmResult);
        rpc.send(propsToConfirmUpload);
        propsToConfirmUpload = [];
    }

    function handlePropsUploadConfirmResult(event/* :OPWSEvent */)/* :void */ {
//			trace("Props upload confirmed");
    }

    function handleNewPropsResult(event/* :OPWSEvent */)/* :void */ {
        for (var propDef/* :Object */ in event.result.props) {
            if (propDef.success) {
                var prop/* :PalaceProp */ = that.getProp(null, propDef.legacy_identifier.id, propDef.legacy_identifier.crc);
                prop.asset.guid = propDef.guid;
                prop.asset.imageDataURL = propDef.image_data_url;
                props[prop.asset.guid] = prop;
                uploadPropToS3(propDef);
            }
        }
    }

    function uploadPropToS3(propDef/* :Object */)/* :void */ {
        var s3/* :Object */ = propDef.s3_upload_data;
        var request/* :URLRequest */ = new URLRequest(propDef.s3_upload_data.upload_url);
        request.method = URLRequestMethod.POST;

        var prop/* :PalaceProp */ = that.getProp(null, propDef.legacy_identifier.id);
        prop.asset.guid = propDef.guid;

        var builder/* :MultiPartFormBuilder */ = new MultiPartFormBuilder({
            success_action_status: 201,
            acl: s3.acl,
            key: s3.key,
            "Content-Type": s3.content_type,
            AWSAccessKeyId: s3.aws_access_key_id,
            Policy: s3.policy,
            Signature: s3.signature,
            Expires: s3.expires,
            file: prop.bitmap
        });
        builder.useBase64 = false;
        request.data = builder.data;
        request.contentType = builder.contentType;

//			trace("Uploading prop id " + prop.asset.id + " - guid " + prop.asset.guid + " - to Amazon S3");
        var guid/* :String */ = prop.asset.guid;
        var loader/* :URLLoader */ = new URLLoader();
        loader.addEventListener(Event.COMPLETE, function (event/* :Event */)/* :void */ {
            var prop/* :PalaceProp */ = that.getProp(guid);
            confirmPropUpload(prop);
//				trace("Upload complete for prop guid: " + prop.asset.guid)
        });
        loader.addEventListener(IOErrorEvent.IO_ERROR, function (event/* :IOErrorEvent */)/* :void */ {
            trace("IO Error while uploading prop guid " + prop.asset.guid);
        });
        loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, function (event/* :SecurityErrorEvent */)/* :void */ {
            trace("Security error while uploading prop guid " + prop.asset.guid);
        });
        loader.dataFormat = URLLoaderDataFormat.TEXT;
        loader.load(request);
    }

    function handleAssetRequestTimer(event/* :Timer Event */)/* :void */ {
        var rpc/* :OPWSGetProps */ = new OPWSGetProps(palaceClient);
        rpc.addEventListener(OPWSEvent.RESULT_EVENT, handleGetPropsResult);
        rpc.addEventListener(OPWSEvent.FAULT_EVENT, handleGetPropsFault);
        console.log('assets to request:');
        console.log(assetsToRequest);
        rpc.send(assetsToRequest);
        assetsToRequest = [];
    }

    function handleGetPropsResult(event/* :OPWSEvent */)/* :void */ {
        for (var response/* :Object */ in event.result['props'] /* as Array */) {
            if (!response['success']) {
//					trace("Unable to get prop " + response['legacy_identifier']['id'] + " from web service, downloading from palace server.");
                client.requestAsset(AssetManager.ASSET_TYPE_PROP,
                    response['legacy_identifier']['id'],
                    response['legacy_identifier']['crc']
                );
            }
            else if (response['legacy_identifier']) {
                var prop/* :PalaceProp */ = that.getProp(null, response['legacy_identifier']['id'], response['legacy_identifier']['crc']);
                if (response['status'] && !response['status']['ready']) {
//						trace("Web service knows about the prop but it's not ready.  Trying again.");
                    that.requestAsset(prop);
                }
                else {
//						trace("Got prop " + response['legacy_identifier']['id'] + " - " + response['guid'] + " from web service.");
                    var flags/* :Object */ = response['flags'];
                    prop.width = response['size']['width'];
                    prop.height = response['size']['height'];
                    prop.horizontalOffset = response['offsets']['x'];
                    prop.verticalOffset = response['offsets']['y'];
                    prop.head = flags['head'];
                    prop.ghost = flags['ghost'];
                    prop.rare = flags['rare'];
                    prop.animate = flags['animate'];
                    prop.palindrome = flags['palindrome'];
                    prop.bounce = flags['bounce'];
                    prop.asset.imageDataURL = response['image_data_url'];
                    prop.asset.name = response['name'];
                    prop.loadBitmapFromURL();
                }
            }
        }
    }

    function handleGetPropsFault(event/* :OPWSEvent */)/* :void */ {
//			trace("There was a problem getting props from the webservice.");
    }

    this.loadImage = function (prop/* :PalaceProp */)/* :void */ {
        that.requestAsset(prop);
    };

    function trace(data) {
        console.log(data);
    }
}

module.exports.getInstance = function ()/* :PalaceProp Store */ {
    if (_instance == null) {
        _instance = new PalacePropStore();
    }
    return _instance;
};
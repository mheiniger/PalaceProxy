var constants = {};

constants.webServiceURL/* :String */ = "http://www.openpalace.org/webservice";
constants.numberPropsToCacheInRAM/* :int */ = 1000;
constants.URIEncodeImageNames/* :Boolean */ = false;
constants.fadeBackgroundImages/* :Boolean */ = true;
constants.highlightHotspotsOnMouseover/* :Boolean */ = false;

function PalaceConfig()
{
    this.constants = constants;
}

module.exports = PalaceConfig;
for (constant in constants) {
    module.exports[constant] = constants[constant];
}
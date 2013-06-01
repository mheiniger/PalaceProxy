//	import flash.xml.XMLDocument;
//	import flash.xml.XMLNode;
//	import flash.xml.XMLNodeType;

module.exports = PalaceUtil;
var htmlUnescape = module.exports.htmlUnescape = function (str/* :String */)/* :String */ {
    //return new XMLDocument(str).firstChild.nodeValue;
    return str;
};

var htmlEscape = module.exports.htmlEscape = function (str/* :String */)/* :String */ {
//		    return XML( new XMLNode( XMLNodeType.TEXT_NODE, str ) ).toXMLString();
    return str;
};

function PalaceUtil()
{
    this.htmlUnescape = htmlUnescape;
    this.htmlEscape = htmlEscape;
}
var fs = require('fs');

var filename = process.argv[2];
var outputFilename = filename.replace(".as", "1.js");

var array = fs.readFileSync(filename).toString().split("\n");
var line;
var classname;

for(var i = 0;i<array.length;i++) {
    line = array[i];

    // add new variable scopes
    if (line.search("public class") > -1) {
        array[i+1] = array[i+1] + "\n" +
            "    this.constants = {};";
        classname = line.match(/public class (\w+)/)[1];
    }
    line = line.replace(/public class (\w+)/, 'function $1\(\)');

    // comment not possible elements
    line = comment(line, ":int");
    line = comment(line, ":Array");
    line = comment(line, ": Array");
    line = line.replace("Array */Collection", "Array Collection */");
    line = comment(line, ":FlexPoint");
    line = comment(line, ":Boolean");
    line = comment(line, ":void");
    line = comment(line, ":String");
    line = comment(line, "\\[Bindable\\]");
    line = comment(line, ":IptEventHandler");
    line = comment(line, ":PalaceIptManager");
    line = comment(line, ":IptTokenList");
    line = comment(line, ":ByteArray");
    line = comment(line, ":HotspotEvent");
    line = comment(line, ":PalaceHotspotState");
    line = comment(line, ":Error");
    line = comment(line, ":Object");
    line = comment(line, ":Number");
    line = comment(line, ":HotSpotImage");
    line = comment(line, ":uint");
    line = comment(line, ":PalacePropStore");
    line = comment(line, ":PalaceProp");
    line = line.replace("PalaceProp */Store", "PalaceProp Store */");
    line = comment(line, ":PropEvent");
    line = comment(line, ":PalaceClient");
    line = comment(line, ":LoaderContext");
    line = comment(line, ":AccountServerClient");
    line = comment(line, ":Socket");
    line = comment(line, ":DebugData");
    line = comment(line, ":PalaceServerInfo");
    line = comment(line, ":PalaceCurrentRoom");
    line = comment(line, ":Timer");
    line = line.replace("Timer */Event", "Timer Event */");
    line = line.replace("Timer Event */=null", "Timer Event =null */");
    line = comment(line, ":PalaceChatRecord");
    line = comment(line, ":Date");
    line = comment(line, ":PalaceController");
    line = comment(line, ":PalaceHotspot");
    line = comment(line, ":SharedObject");
    line = comment(line, ":PalaceUser");
    line = comment(line, ":RegistrationCode");
    line = comment(line, ":PalaceEvent");
    line = comment(line, ":SecurityErrorEvent");
    line = comment(line, ":PalaceSecurityErrorEvent");
    line = comment(line, ":IOErrorEvent");
    line = comment(line, ":Event");
    line = comment(line, ":ProgressEvent=null");
    line = comment(line, ":PalaceDrawRecord");
    line = comment(line, ":PalaceAsset");
    line = comment(line, ":PalaceImageOverlay");
    line = comment(line, ":IptEngineEvent");
    line = line.replace("IptEngineEvent */=null", "IptEngineEvent=null */");
    line = comment(line, ":NavErrorMessage");
    line = comment(line, ":PalaceLooseProp");
    line = comment(line, ":PalaceRoom");
    line = comment(line, ":ChatEvent");
    line = line.replace("PalaceRoom */View", "PalaceRoom View */");
    line = line.replace("PalaceRoom */Event", "PalaceRoom Event */");
    line = comment(line, "as Array");


    line = line.replace("/* /*", "/*");
    line = line.replace("*/ */", "*/");
    line = line.replace(/\:Vector\.<(\w+)\>/, "/* :Vector.<$1> */");
    line = line.replace("new Vector.<uint>()", "{}");
    line = line.replace("for each", "for");


    line = line.replace(/extends (\w+)/, '\/\/extends $1');
    line = line.replace(/public function set (\w+)/, 'var set_$1 = this.set_$1 = function');
    line = line.replace(/public function get (\w+)/, 'var get_$1 = this.get_$1 = function');
    line = line.replace(/public function (\w+)/, 'var $1 = this.$1 = function');
    line = line.replace(/public static function (\w+)/, 'var $1 = this.$1 = this.constants.$1 = function ');


    line = line.replace(/public static const (\w+)/, 'var $1 = this.$1 = this.constants.$1');
    line = line.replace(/public const (\w+)/, 'var $1 = this.constants.$1');

    line = line.replace(":Vector.<IptEventHandler> = new Vector.<IptEventHandler>()", "= {}");


    line = line.replace(/public var (\w+)/, "var $1 = this.$1");
    line = line.replace("private var ", "var ");
    line = line.replace("private static function ", "function ");
    line = line.replace("private function ", "function ");
    line = line.replace("private static var ", "");
    line = line.replace("public static var ", "");


        //line = line.replace(/public class (.*)/, );

    line = commentLine(line, /\[Event\(/);
    line = commentLine(line, "import");
    line = commentLine(line, /\[Bindable\(/);


    if (line.search("package") > -1) {
        line = "//" + line;
        array[i+1] = "//" + array[i+1];
    }

    console.log(line);
    array[i] = line;
}

array[array.length-1] = "//" + array[array.length-1];
array[array.length] = array[array.length]||'' + "\n" +
    "module.exports = " + classname + ";\n" +
    "var " + classname + "Var = new " + classname + "();\n" +
    "for (name in " + classname + "Var.constants) {\n" +
    "   module.exports[name] = " + classname + "Var.constants[name];\n" +
    "}"

function comment(line, word){
    var re = new RegExp(word,"g");
    return line.replace(re, "/* " + word + " */");
}

function commentLine(line, regexp){
    if (line.search(regexp) > -1){
        return "//" + line;
    } else {
        return line;
    }
}

fs.writeFileSync(outputFilename, array.join("\n"));

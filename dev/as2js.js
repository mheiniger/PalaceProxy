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
            "    this.publicFunctions = {};\n" +
            "    this.publicVars = {};\n" +
            "    this.constants = {};";
        classname = line.match(/public class (\w+)/)[1];
    }
    line = line.replace(/public class (\w+)/, 'function $1\(\)');

    // comment not possible elements
    line = comment(line, ":int");
    line = comment(line, ":Array");
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



    line = line.replace(/extends (\w+)/, '\/\/extends $1');
    line = line.replace(/public function set (\w+)/, 'var set_$1 = this.publicFunctions.set_$1 = function');
    line = line.replace(/public function get (\w+)/, 'var get_$1 = this.publicFunctions.get_$1 = function');
    line = line.replace(/public function (\w+)/, 'var $1 = this.publicFunctions.$1 = function');


    line = line.replace(/public static const (\w+)/, 'var $1 = this.constants.$1');
    line = line.replace(/public const (\w+)/, 'var $1 = this.constants.$1');

    line = line.replace(":Vector.<IptEventHandler> = new Vector.<IptEventHandler>()", "= {}");


    line = line.replace(/public var (\w+)/, "var $1 = this.publicVars");
    line = line.replace("private var ", "var ");

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
    "for (name in " + classname + ".constants) {\n" +
    "   module.exports[name] = " + classname + ".constants[name];\n" +
    "}\n" +
    "for (name in " + classname + ".publicFunctions) {\n" +
    "   module.exports[name] = " + classname + ".publicFunctions[name];\n" +
    "}\n" +
    "for (name in " + classname + ".publicVars) {\n" +
    "   module.exports[name] = " + classname + ".publicVars[name];\n" +
    "}\n"

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

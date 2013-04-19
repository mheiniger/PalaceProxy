var fs = require('fs');

var filename = process.argv[2];
var outputFilename = filename.replace(".as", "1.js");

var array = fs.readFileSync(filename).toString().split("\n");
var line;

for(i in array) {
    line = array[i];

    line = line.replace(":int", "/* :int */");
    line = line.replace(":Array", "/* :Array */");
    line = line.replace("Array */Collection", "Array Collection */");
    line = line.replace(":FlexPoint", "/* :FlexPoint */");
    line = line.replace(":Boolean", "/* :Boolean */");
    line = line.replace(":void", "/* :void */");



    line = line.replace(":Vector.<IptEventHandler> = new Vector.<IptEventHandler>()", "= {}");



    line = line.replace("public var ", "var ");
    line = line.replace("private var ", "var ");

    //line = line.replace(/public class (.*)/, );

    if (line.search(/\[Event\(/) > -1) {
        line = "//" + line;
    }



    console.log(line);
    array[i] = line;
}

fs.writeFileSync(outputFilename, array.join("\n"));

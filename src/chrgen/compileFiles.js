

var fs = require('fs');
var path = require('path');
var mm = require('minimist');

var argv = mm(process.argv.slice(2));

var outdir = argv.output ? argv.output : (argv.o ? argv.o : 'dist');

var files = argv._;

console.log('outdir:',outdir);
console.log('files:',files);

var Compiler = require('./compile.js');

console.log('compiler version:', Compiler.VERSION);

function procFile(outdir, filename, callback) {
        var fullname = path.resolve(filename);
        console.log('processing:',fullname);
        var js = fs.readFileSync(fullname, 'utf8');

        // var jsp = Compiler.parse(js);
        // jsp.body.forEach(Compiler.compile);
        // var jsOut = Compiler.generate(jsp);

        // or: 
        var jsOut = Compiler.parseCompileGenerate(js);

        var filenameOut = path.basename(fullname);
        var fullnameOut = path.join(outdir,filenameOut);
        console.log('writing:',fullnameOut);
        fs.writeFileSync(fullnameOut,jsOut);
}

if (files.length === 0) {
	console.log('usage: node compileFiles.js -o/--output <outdir> (default \'dist\') <filename1> <filename2> ...');
	// console.log('for help: node compileFiles.js -h (--help)');
	return;
}

if (!fs.existsSync(outdir)){
  fs.mkdirSync(outdir);
}

files.forEach(function(f) {
    try {
			procFile(outdir, f);
    } catch (e) {
        console.log(e);
    }
});



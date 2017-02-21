
path=./src/chrgen/

def=build/test
outdir=${1:-$def}

mkdir -p $outdir
node $path/compileFiles.js -o $outdir testchr/compilerPanel.js
node $path/compileFiles.js -o $outdir testchr/playground.js
node $path/compileFiles.js -o $outdir testchr/reactive.js
node $path/compileFiles.js -o $outdir testchr/testelem.js

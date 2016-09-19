# node compileFiles.js -o out testchr/test.js
# node compileFiles.js -o out testchr/taskflow.js
path=./src/chrgen/

outdir=${1:-out}

mkdir -p $outdir
node $path/compileFiles.js -o $outdir testchr/compilerPanel.js
node $path/compileFiles.js -o $outdir testchr/playground.js
node $path/compileFiles.js -o $outdir testchr/testelem.js
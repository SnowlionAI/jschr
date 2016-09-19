
cd src/chrgen 
./browserifychrgen.sh
cd ../chr 
./browserifychr.sh
cd ../..

def=build/dist
outdir=${1:-$def}

mkdir -p $outdir
# mkdir -p ./build/dist

mv src/chrgen/chrgenbundle.js $outdir/chrgenbundle.js
mv src/chr/chrbundle.js $outdir/chrbundle.js


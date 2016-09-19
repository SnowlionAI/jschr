
cd src/chrgen 
./browserifychrgen.sh
cd ../chr 
./browserifychr.sh
cd ../..

mkdir -p ./dist
mv src/chrgen/chrgenbundle.js dist/chrgenbundle.js
mv src/chr/chrbundle.js dist/chrbundle.js


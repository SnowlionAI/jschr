
browserify -r ./constraint.js -r  ./chr.js -r  ./var.js -r ./varref.js \
	-r ./store.js -r ./index.js -r ./match.js \
	-r ./utils.js -r ./checks.js > chrbundle.js


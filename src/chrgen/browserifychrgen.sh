
# npm install -g esprima
# npm install -g escodegen
# npm install -g esrecurse
# npm install -g esutils

browserify -r ./checks.js -r ./generate.js -r ./compile.js \
	-r esprima -r escodegen -r esutils -r esrecurse > chrgenbundle.js



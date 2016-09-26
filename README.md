# **JSCHR**

Compile and run Constraint Handling Rules (CHR) in JavaScript.

**warning: this code is alphaware and shouldn't be used in production environments.** 

## Features

 1. Speed comparable to SWI-prolog (sometimes)
 2. Trampoline to avoid stack limits 
 3. Close integration with javascript
 4. Easy to add clauses or inspect the store from javascript 
 4. Transpile javascript files containing CHR in browser and from command line (using node)

## On the downside

 1. Slightly different syntax 
 2. Much of it is untested
 3. No documentation yet

## Try it out yourself...



## Installation
*on linux*
 1. Clone or download the repository 
 2. Ensure node and npm are installed
 2. Add javascript parser and generator dependencies:
	a. npm install -g esprima
	b. npm install -g escodegen
	c. npm install -g esrecurse
	d. npm install -g esutils
 3. Add node commandline compiler dependencies:
	a. npm install -g fs
	b. npm install -g path
	c. npm install -g minimist

*on other systems*
No documentation yet, but if node runs, it shouldn't be too different from a linux installation.

## Getting Started

To compile the runtime system after changes in de src directory, run the following command from command line:
./browsify.sh

To compile user files you have to adjust compiler.sh file according to your situation and run it from the command line: 
./compiler.sh

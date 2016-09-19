# JSCHR

Compile and run Constraint Handling Rules (CHR) in JavaScript.

JSCHR 

## Getting Started


## Example


More example CHR scripts are provided at [chrjs.net](http://chrjs.net/).

Defining CHR rules in this way, they are compiled at runtime, that means we use a just-in-time (JIT) compilation. However, for performance reasons, we encourage the use of an ahead-of-time (AOT) compiler as presented in the [next section](#aot-compilation).

## AOT Compilation


    npm install babel-plugin-chr
    babel --plugins chr script.js


## REPL

## Background


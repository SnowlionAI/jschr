(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Utils = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let Var = require('./var.js');
    let Checks = require('./checks.js');

	let assign = function(v,val) {
		if (val === null)
			v.set(null)
		else {
			Var.wait(val, function(valref) {
				let vref = Var.get(v);
				if (vref === Var.NOVALUE)
					v.set(valref);
				else {
					if (vref != valref) {
						throw Error('Cannot assign ' + valref + ' to ' + vref);
					}
				}
			});			
		}
	}


	let iterEmpty = {
			next: function() {},
			more: function() { return false; }
	}


	let keys = function(obj) { return Object.keys(obj); } 

	let iter = function(arrIn) {
		if (!arrIn || arrIn.length == 0) 
			return iterEmpty;

		let arr = arrIn.slice();
		let len = arr.length;
		let i = 0;
		return {
			next: function() {
				if (i < len)
					return arr[i++];
			},
			more: function() { return i < arr.length; }
		}
	}

	let iterObj = function(ref) { return Utils.iterRef(Utils.keys(ref),ref) };

	let iterRef = function(arrIn,ref) {
		if (!arrIn || arrIn.length == 0) 
			return iterEmpty;

		let arr = arrIn.slice();

		let len = arr.length;
		let i = 0;
		return {
			next: function() {
				if (i < len)
					return ref[arr[i++]];
			},
			more: function() { return i < arr.length; }

		}
	}

	let iterExcl = function(arrIn,excl) {
		if (!arrIn || arrIn.length == 0) 
			return iterEmpty;

		let arr = arrIn.slice();

		let len = arr.length;
		let i = 0;

		let f = excl === undefined ? function() { return true; } : 
			Checks.isFunction(excl) ? excl : function(n) { 
					return excl[n] === undefined; 
				};

		let next = function() {
				if (i >= len)
					return;
				let n = arr[i++];
				if (!f(n))
					return next();
				// let n = ref ? ref[ni] : ni; 
				return n;
			};
		return {
			next: next,
			more: function() { return i < arr.length; }

		}
	}

	let iterCollect = function(it) {
		let acc = [];
		let v = it.next();
		while (v) {
			acc.push(v);
			v = it.next();
		}
		return acc;

	}


	let binaryInsert = function(arr,elem,dupl=true,comp=function(a,b) { return a - b; }) {
		let ix = binaryIndexOf(arr,elem,comp);
		if (ix < 0)
			ix = ~ix;
		else if (dupl === false)
			return ix;
		arr.splice(ix,0,elem);
		return ix;
	}

	let binaryRemove = function(arr,elem,remdupl=true,comp=function(a,b) { return a - b; }) {
		let ix = binaryIndexOf(arr,elem,comp);
		if (ix < 0)
			return false;
		arr.splice(ix,1);
		if (remdupl) {
			while (comp(arr[ix],elem) == 0.0) {
				arr.splice(ix,1);
			}
		}
		return true;
	}

	let binaryIndexOf = function(arr,searchElement,comp=function(a,b) { return a - b; }) {

	    let min = 0;
	    let max = arr.length - 1;
	    let mid, cmp;
	    let currentElement;

	    // provision for inserting ordered elements
	    if (max >= 0) {
	    	let cmp = comp(arr[max],searchElement);
	    	if (cmp < 0.0)
	    		return ~(max+1);
	    }

	    while (min <= max) {
	        mid = (min + max) >> 1;
	        cmp = comp(arr[mid],searchElement);

	        if (cmp < 0.0) {
	            min = mid + 1;
	        }
	        else if (cmp > 0.0) {
	            max = mid - 1;
	        }
	        else {
	            return mid;
	        }
	    }

	    return ~min;
	}


	let memoize = function(func, max) {
	    max = max || 5000;
	    return (function() {
	        var cache = {};
	        var remaining = max;
	        function fn(n) {
	            return (cache[n] || (remaining-- >0 ? (cache[n]=func(n)) : func(n)));
	        }
	        return fn;
	    }());
	}


	let log = console.log.bind(console);

	let between = function(min,max) {
		let r = Math.random();
		return min + Math.floor((max - min) * r);
	}

	let Utils = {
		assign: assign,
		keys: keys,
		iter: iter,
		iterExcl: iterExcl,
		iterRef: iterRef,
		iterObj: iterObj,
		iterEmpty: iterEmpty,
		iterCollect: iterCollect,
		between: between,
		binaryIndexOf: binaryIndexOf,
		binaryInsert: binaryInsert,
		binaryRemove: binaryRemove,
		log: log,
		VERSION: version
	}

	return Utils;
}));


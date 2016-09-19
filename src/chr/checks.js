(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Checks = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";


	let getType = function (elem) {
	  return Object.prototype.toString.call(elem).slice(8, -1);
	};

	let isObject = function (elem) {
	  return getType(elem) === 'Object';
	};

	let isArray = function (elem) {
	  return getType(elem) === 'Array';
	};

	let isNumber = function (elem) {
	  return getType(elem) === 'Number';
	};

	let isString = function (elem) {
	  return getType(elem) === 'String';
	};

	let isFunction = function (elem) {
	  return getType(elem) === 'Function';
	};

	let Checks = {
		'getType': getType,
		'isObject': isObject,
		'isFunction': isFunction,
		'isArray': isArray,
		'isNumber': isNumber,
		'isString': isString,
		'VERSION': version
	}

	return Checks;
}));


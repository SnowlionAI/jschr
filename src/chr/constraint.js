(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Constraint = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";


	let Checks = require('./checks.js');
	let Var = require('./var.js');

	let isAlive = function(c) { return c.isAlive(); }
	let allAlive = function(carr) {
		let len = carr.length; 
		for (let i = 0; i < len; i++) {
			if (!carr[i].isAlive())
				return false;
		}
		return true;
	}


	let Constr = function(name, args) {
		if (!args) 
			args = [];
	  this.name = name;
	  this.arity = args.length;
	  this.nameArity = this.name + "/" + this.arity;
	  this.args = args;
	  this.id = null;
	  this.alive = true;
	  // cannot store functions...
	  // this.onRemoveArr = [];
	}

	// let isConstraint = function(c) { return c != null && c.__proto__.constructor.name == 'Constraint'; }
	let isConstraint = function(c) { return c != null && c.constructor === Constraint; }



	// Constr.prototype.onRemove = function(f) { this.onRemoveArr.push(f); }

	Constr.prototype.remove = function() {
		// this.alive = false;
		let arr = this.onRemoveArr;
		this.onRemoveArr = undefined;
		if (arr && arr.length) {
			arr.map(function(f) { f(); });
		}
	}

	Constr.prototype.equal = function (v) { return this.id == v.id; }

	Constr.prototype.isAlive = function() { return this.alive; }

	Constr.prototype.show = function () { return this.nameArity +  this.showArgs() + '#' + this.id; }

	Constr.prototype.showArgs = function () {
		if (this.args.length == 0)
			return '' 
		let res = '(';
		for (let i = 0; i < this.args.length; i++) {
			let a = this.args[i];
			let r = a.valueOf ? a.valueOf() : a;
			if (Var.isVar(r))
				res += r.show();
			else if (Checks.isObject(r))
				res += JSON.stringify(this.args[i].valueOf());
			else if (Checks.isString(r))
				res += '\'' + this.args[i].valueOf() + '\'';
			else 
				res += this.args[i].valueOf();
			if (i + 1 < this.args.length)
				res += ','
		}
		res += ')'
		return res;
	}

	Constr.prototype.toString = function() { return this.show(); }

	let Constraint = Constr;

	Constraint.isAlive = isAlive;
	Constraint.allAlive = allAlive;
	Constraint.isConstraint = isConstraint;
	Constraint.VERSION = version;

	return Constraint;
}));

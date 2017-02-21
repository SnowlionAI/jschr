(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Store = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let Utils = require('./utils.js');
    let Var = require('./var.js');
    let Index = require('./index.js');
    let Constraint = require('./constraint.js');

	let Store = function(chr) {
		this.chr = chr;
		this.items = {};
		this.index = new Index(this);
		this.lastID = -1;
		this._keys = {};
		this._persistKeys = {};
	}

    let randomhex = function() {
        return Math.random().toString(16).slice(2);
    }

	Store.prototype.newID = function newID() {
	  this.lastID += 1;
      // window.hexdigit = randomhex();
	  return this.lastID;
	}

	Store.prototype.has = function(na) {
		return this.keys(na).length > 0;	
	}

	Store.prototype.add = function add(na,args,key,value) {

		let len = args.length;

		if (!this.items[na]) {
			this.items[na] = {};
			this._keys[na] = [];
			this._persistKeys[na] = [];
			this.index.ensureIxs(na,len);
		}

		this.items[na][key] = value;
		if (this._keys[na]) {
			this._keys[na].push(key);
			this._persistKeys[na] = this._keys[na].slice();
		}

		for (let i = 0; i < len; i++) {
			let a = args[i];
			let v = a ? a.valueOf() : a;
			let ix = i;
			if (Var.isVar(v)) {
				v.onSet(a => {
					this.index.removeVar(na,ix,key);
					this.index.add(na,ix,a,key);
				})
				this.index.addVar(na,ix,key);
			}
			else 
				this.index.add(na,ix,v,key);
		}

	}


	Store.prototype.remove = function remove(na,args,key) {
		if (!this.items[na]) {
			return;
		}

		let len = args.length;
		for (let i = 0; i < len; i++) {
			let a = args[i];
			if (a)
				a = a.valueOf();
			if (Var.isVar(a))	
				this.index.removeVar(na,i,key); 	// may have been variable when added...  
			else
				this.index.remove(na,i,a,key);
		}

		// this._keys[na] = undefined;
		let ks = this._keys[na];	
		if (ks !== undefined) {
			// Utils.binaryRemove(ks,key);
			let ix = ks.indexOf(key);
			if (ix >= 0) {
				ks.splice(ix,1);
			}
			this._persistKeys[na] = ks.slice();
		}

		delete this.items[na][key];
		// this.items[na][key] = undefined;
	}


	Store.prototype.valueIter = function (na) {
		let keys = this.keys(na);
		if (keys.length === 0)
			return;
		return Utils.iterRef(keys,this.items[na]);
	}

	let THRESHOLD = 7;

	Store.prototype.threshold = function(na) { return this.keys(na).length >= THRESHOLD; }

	Store.prototype.keys = function keys(na) {
			if (!this._keys[na]) {
					this._persistKeys[na] = [];
			}
			return this._persistKeys[na];
	}

	Store.prototype.select = function(na,opts,excl,func) {

		opts = opts || {};
		excl = excl || {};
		let cmb;

		let cs = this.items[na];
		if (opts.index) {
			cmb = this.index.select(na,opts.index,this.keys(na),cs,excl);
		}

		if (!cmb) {
			let bs = this.keys(na);
			let len = bs.length;
			let i = 0;
			cmb = {
				next: function() {
					while (i < len) {
						let k = bs[i++];
						if (!excl[k])
							return k;
					}
				}
			}
		}

		let self = this;
		let cont = true;
		let nextSel = function() {
			if (!cont) {
				return;
			}

			let key = cmb.next();
			let r = false;
			while (key !== undefined && !r) {
				let n = cs[key];
				r = n !== undefined && (!opts.check || opts.check(n));
				if (r) {
					self.chr.cont(nextSel);
					cont = func(n);
				}
				else {
					key = cmb.next();
				}
			}
		}
		nextSel();
	}


	Store.prototype.show = function(na,m,n) {

		let cs = this.getItems(); 
		if (na !== undefined && na.constructor === String)
			cs = cs.filter(function(c) { return c[Constraint.nameAritySym] === na; });
		else if (na !== undefined && na.constructor === Number) {
			n = m;
			m = na;
		}

		if (n === undefined)
			n = cs.length;	
		if (m === undefined) {
			m = 0;
		}
		if (n < 0)
			n = cs.length - n;

		cs = cs.slice(m,n); 
		cs.sort().map(function(c) { console.log(Constraint.show(c)); })
		console.log('constraint#:',cs.length);
	}


	Store.prototype.getItems = function(na) {
		let all = new Array();
		if (na === undefined)
			this.each(function(c) { all.push(c); });
		else
			this.eachNA(na,function(c) { all.push(c); });
		return all;
	}

	Store.prototype.logdata = function() {
		this.getItems().map(function (c) { console.log(c.show());});
	}

	Store.prototype.each = function(na,f) {
		if (f === undefined) {
			f = na;
			for (let ct in this.items) {
				this.eachNA(ct,f);
			}
		}
		else {
			this.eachNA(na,f);
		}
	}

	Store.prototype.eachNA = function(na,f) {
		let cts = this.items[na];
		for (let c in cts) {
			if (cts.hasOwnProperty(c))
				f(cts[c]);
		}
	}

	Store.VERSION = version;

	return Store;
}));


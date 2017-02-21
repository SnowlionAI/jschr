 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.CHR = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let Constraint = require('/constraint.js');
    let Var = require('/var.js');
    let Index = require('/index.js');
    let Match = require('/match.js');
    let Utils = require('/utils.js');
    let Store = require('./store.js');

    let nameAritySym = Constraint.nameAritySym;
    let argsSym = Constraint.argsSym;
	let idSym = Constraint.idSym;
	let aritySym = Constraint.aritySym;

	let CHR = function() {
		this.Store = new Store(this);
		this.ConstraintListeners = new Store(this);
		this.Conts = [];
		this.trampoline = true;
		this.onAddhandler = { all:[], na:{} };
		this.onRemovehandler = { all:[], na:{} };
		this.handlerKeys = 0;
		this.timestamp = performance.now();
	};

	CHR.Modules = {};

	CHR.prototype.reset = function() {
		this.Store = new Store(this);
		this.Conts = [];
	}

	CHR.prototype.addConstraintListener = function(na,indexes,rulefunc) {
		let key = this.ConstraintListeners.newID();
		this.ConstraintListeners.add(na,indexes,key,rulefunc);
		return key;
	};

// 	CHR.prototype.addConstraint = function(n,args=[]) {
// 	    let c;
// 	    if (Constraint.isConstraint(n)) {
// 	      c = n;
// 	      // Constraint.addArgs(c,args);
// 	    }
// 	    else {
// 	      let sargs = Array.prototype.slice.call(args);
// 	  		c = Constraint.makeConstraint(n,sargs);
// 	    }
// 		let self = this;
// 		c[idSym] = self.Store.newID();
// if (this.debug === true) {
//   console.log('ADD',c.show());
// }
// 		this.cont(function() {
// 			let na = c[nameAritySym];
// 			if (!self.handleAdd(c))
// 				return;
// 			self.Store.add(na,c[argsSym],c[idSym],c);
// 			self.addCont(na,c);
// 		});
// 		return c;
// 	};

	CHR.prototype.add = function(c,n,args) {
		if (Constraint.isConstraint(c)) {
            c = Constraint.clone(c);
			if (n !== undefined) {
				if (Array.isArray(n) && n.length > 0) {
					Constraint.addArgs(c,n);			
				}
				else if (n.constructor === String) {
					Constraint.setName(c,n);
					args !== undefined && args.length > 0 && Constraint.addArgs(c,args);
				}				
			}
		}
	    else { // if (!Constraint.isConstraint(c))
			c = Constraint.makeConstraint(c,n,args);
		}
if (this.debug === true) {
  console.log('ADD',c.show());
}
		let key = this.Store.newID();
        // let key = Utils.randomhex();
		c[idSym] = key;
		let na = c[nameAritySym];
		if (!this.handleAdd(c))
			return;
		this.Store.add(na,c[argsSym],key,c);
		this.addCont(na,c);
		return c;
	};

	CHR.prototype.addCont = function(na,c) {
		if (!this.ConstraintListeners.has(na)) {
      if (this.debug === true) {
        console.log('NOT FOUND',na);
      }
      return;
    }
		else if (!this.ConstraintListeners.threshold(na)) {
			let it = this.ConstraintListeners.valueIter(na);
			if (it) {
				this.delay(c,it)
			}
		}
		else {
			let iargs = [];
			let len = c[aritySym];
			for (let i = 0; i < len; i++) {
				let a = c[argsSym][i];
				let v = a ? a.valueOf() : a;
				if (v && (v.constructor === Number || v.constructor === String)) {
					iargs.push({i:i,f:(function(ref) { return function(idx) {
						let ix = idx[ref];
						if (ix !== undefined)
							return Utils.iter(ix);
					}})(v)});
				};
			};

			this.ConstraintListeners.select(na,{index:iargs},{},function(f) {
				if (!Constraint.alive(c))
					return false;
				f(c);
				return true;
			});

		}
	};

	let handle = function(arr,c) {
		if (arr === undefined)
			return true;
		let len = arr.length;
		let ret = true;
		for (let i = 0; i < len; i++) {
			ret = arr[i].f(c) && ret;
		}
		return ret;
	};


	CHR.prototype.handleAdd = function(c) { return this.handleAddRem(this.onAddhandler,c); };
	CHR.prototype.handleRemove = function(c) { return this.handleAddRem(this.onRemovehandler,c); };

	CHR.prototype.handleAddRem = function(onArr,c) {
		let r1 = handle(onArr.all,c);
		let r2 = handle(onArr.na[c[nameAritySym]],c);
		return r1 && r2;
	};

	CHR.prototype.onAdd = function(na,f) { this.onAddRem('onAddhandler',na,f); };
	CHR.prototype.onRemove = function(na,f) { this.onAddRem('onRemovehandler',na,f); };

	CHR.prototype.onAddRem = function(handler,na,f) {
		if (na.constructor === Function) {
			f = na;
			na = undefined;
		}
		if (f === undefined)
			return;
		let arr;
		if (na === undefined) {
			arr = this[handler].all;
			let id = this.handlerKeys++;
			arr.push({id:id,f:f});
			return {id:id};
		}
		else {
			arr = this[handler].na[na];
			if (!arr) {
				arr = [];
				this[handler].na[na] = arr;
			}
			let id = this.handlerKeys++;
			arr.push({id:id,f:f});
			return {na:na,id:id};
		}
	}

	let removeHandlerArr = function(id,arr) {
		if (arr === undefined)
			return;
		let ix = arr.findIndex(e => e[idSym] === id);
		if (ix >= 0) {
			arr.splice(ix,1);
		}
	}

	CHR.prototype.removeHandler = function(handlerID) {
		if (handlerID === undefined)
			return;
		let id = handlerID.id;
		let na = handlerID.na;
		if (na === undefined)
			removeHandlerArr(id,this.onRemovehandler.all);
		else
			removeHandlerArr(id,this.onRemovehandler.na[na]);
	}

	CHR.prototype.remove = function(c,f) {
		if (Array.isArray(c)) {
			let self = this;
			c.map(function(a) { self.remove(a); })
			return;
		}
		if (c.constructor === String) {
			let rem = this.doRemove.bind(this);
			if (f === undefined)
				this.eachConstraint(c,rem);
			else
				this.eachConstraint(c,function(c2) { f && f(c2) && rem(c2); });
			return;
		}

if (this.debug === true) {
  console.log('REMOVE',c.show());
}
		this.doRemove(c);
	};

	CHR.prototype.doRemove = function(c) {
		this.Store.remove(c[nameAritySym],c[argsSym],c[idSym]);
		c[Constraint.aliveSym] = false;
		Constraint.remove(c);
		this.handleRemove(c);
	};

	CHR.prototype.has = function(na,n) {
		return this.Store.keys(na).length >= n;
	}

	CHR.prototype.select = function(na,opts,excl,func) {
		if (typeof excl == "function") {
			func = excl;
			excl = {};
		}
		// else
		// 	excl = Utils.excl(excl);
		this.Store.select(na,opts,excl,func);
	}

	CHR.prototype.delay = function(c,it) {
		if (!Constraint.alive(c))
			return;
		let f = it.next();
		if (it.more()) {
			let self = this;
			this.cont(function() { self.delay(c,it); })
		}
		f.call(this,c);
	}


	CHR.prototype.set = function(c,v) {
		Var.isVar(c) && c.set(v);
		this.resolve();
	}



	CHR.prototype.setTrampoline = function(b) {
		this.resolve();
		if (b) {
			this.cont = CHR.prototype.contTramp;
		}
		else {
			this.cont = CHR.prototype.contPlain;
		}
		this.trampoline = b;
	}

	CHR.prototype.contPlain = function(f) {
		if (typeof f == "function")
			f();
		else
			f.forEach(function(func) { func(); });
	}


	CHR.prototype.contTramp = function(f) {
		if (typeof f == "function")
			this.Conts.push(f);
		else
			this.Conts = this.Conts.concat(f);
	}

	CHR.prototype.cont = CHR.prototype.contTramp


    CHR.prototype.resolveCall = function(c,n,args) {
        let self = this;
        this.resolveOne(function() { self.call(c,n,args); });
	}

    CHR.prototype.resolveOne = function(f) {
		let point = this.Conts.length;
		// if (point < 0)
		// 	point = 0;
		if (f)
			f();
		while (this.Conts.length > point)
			this.Conts.pop()();
	};

	CHR.prototype.resolve = function() {
		while (this.Conts.length > 0)
			this.Conts.pop()();
	};

	let uniqueId = 0;
	CHR.prototype.getUniqueN = function() { return uniqueId++; };

	CHR.prototype.getConstraints = function(na) { return this.Store.getItems(na); }
	CHR.prototype.eachConstraint = function(na,f) { this.Store.each(na,f); }

	CHR.VERSION = version;

	CHR.Constraint = Constraint;
	CHR.Var = Var;
	CHR.Index = Index;
	CHR.Match = Match;
	CHR.Utils = Utils;
	CHR.Store = Store;

	CHR.all = Var.all;
	CHR.wait = Var.wait;

	// CHR.id = Constraint.id ;
	// CHR.name = Constraint.name; 
	// CHR.nameArity = Constraint.nameArity;
	// CHR.args = Constraint.args; 
	// CHR.alive = Constraint.alive;
	// CHR.allAlive = Constraint.allAlive;

	CHR.show = Constraint.show;
	CHR.makeConstraint = Constraint.makeConstraint;

	CHR.eq = Index.eq;

	CHR.assign = Utils.assign;

	// convenience functions

	CHR.prototype.call = CHR.prototype.add


    return CHR;
}));

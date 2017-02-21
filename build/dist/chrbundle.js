require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/checks.js":[function(require,module,exports){
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


},{}],"/chr.js":[function(require,module,exports){
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

},{"./store.js":"/store.js","/constraint.js":"/constraint.js","/index.js":"/index.js","/match.js":"/match.js","/utils.js":"/utils.js","/var.js":"/var.js"}],"/constraint.js":[function(require,module,exports){

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

    let alive = function(c) { return c[aliveSym]; }
    let allAlive = function(carr) {
        let len = carr.length;
        for (let i = 0; i < len; i++) {
            if (!alive(carr[i]))
                return false;
        }
        return true;
    }

    let nameSym = Symbol('name');
    let aritySym = Symbol('arity');
    let nameAritySym = Symbol('nameArity');
    let argsSym = Symbol('args');
    let idSym = Symbol('id');
    let aliveSym = Symbol('alive');
    // let isAliveSym = Symbol('isAlive');

    let nargs = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28.29,30,31,32];
    let argKeySyms = nargs.map((_n,i) => '_$' + i);

    let Constr = function(name,args,obj) {
        if (!args)
            args = [];
        this[nameSym] = name;
        this[aritySym] = args.length;
        this[nameAritySym] = this[nameSym] + "/" + this[aritySym];
        this[argsSym] = args;
        this[idSym] = null;
        this[aliveSym] = true;
        this.obj = obj;
        if (obj) {
            for (var i = 0; i < args.length; i++) {
                this[argKeySyms[i]] = obj[args[i]];
            }
        }
        else {
            for (var i = 0; i < args.length; i++) {
                this[argKeySyms[i]] = args[i];
            }           
        }
        // cannot store functions...
        // this.onRemoveArr = [];
    }




    let isConstraint = function(c) { return c[Constraint.nameSym] !== undefined }
    // let isConstraint = function(c) { return c != null && c.__proto__.constructor.name == 'Constraint'; }
    // let isConstraint = function(c) { return c != null && c.constructor === Constraint; }

    let clone = function(src) { 
        let dest = {};
        dest[nameSym] = src[nameSym];
        dest[aritySym] = src[aritySym];
        dest[nameAritySym] = src[nameAritySym];
        dest[argsSym] = src[argsSym].slice();
        dest[idSym] = null;
        dest[aliveSym] = true;
        let n = dest[aritySym];
        dest.obj = src.obj;
        for (var i = 0; i < n; i++)
            dest[argKeySyms[i]] = src[argKeySyms[i]];
        return dest;
    }


    let id = function(c) { return c[idSym]; };
    let name = function(c) { return c[nameSym]; };
    let nameArity = function(c) { return c[nameAritySym]; };
    let args = function(c,i) { return c[argKeySyms[i]]; };
    let getObj = function(c) { return c.obj; };


    let resetNameArity = function(c) { c[nameAritySym] = c[nameSym] + "/" + c[aritySym]; }

    let setName = function(c,n) { 
        c[nameSym] = n;
        resetNameArity(c);
    }

    let addArgs = function(c,args) { 
        let ca = c[aritySym];
        c[aritySym] += args.length;
        resetNameArity(c);
        let len = ca + args.length;
        for (let i = ca, ii = 0; i < len; i++, ii++) {
            let a = args[ii];
            c[argsSym].push(a);
            c[argKeySyms[i]] = a;
        }
    }

    let makeConstraint = function(obj,name,args=[]) {
        if (obj.constructor === String) {
            args = name;
            name = obj;
            return new Constr(name,args);
        }
        else {
            if (Array.isArray(name)) {
                args = name;
                name = obj.constructor.name;            
                return new Constr(name,args,obj);
            }
            else {
                name = name || obj.constructor.name;
                return new Constr(name,args,obj);
            }
        }
    }


    let eq = function(c1,c2) { let i = id(c1); return (i !== null && i === id(c)); }

    // Constr.prototype.clone = function(c) { return makeConstraint(c[nameSym],c[argsSym]); }
    // Constr.prototype.onRemove = function(f) { this.onRemoveArr.push(f); }

    let remove = function(c) {
        let arr = c.onRemoveArr;
        c.onRemoveArr = undefined;
        if (arr && arr.length) {
            arr.map(function(f) { f(); });
        }
    }


    // Constr.prototype.equal = function (v) { return this[idSym] == v[idSym]; }
    // Constr.prototype.isAlive = function() { return this[aliveSym]; }

    let showArgs = function (c) {
        if (c[argsSym].length == 0)
            return ''
        let res = '(';
        for (let i = 0; i < c[argsSym].length; i++) {
            let a = c[argsSym][i];
      if (a === undefined || a === null)
        res += a;
      else {
        let r = a.valueOf ? a.valueOf() : a;
            if (Var.isVar(r))
                res += r.show();
            else if (Checks.isObject(r))
                res += JSON.stringify(r);
            else if (Checks.isString(r))
                res += '\'' + r + '\'';
            else
                res += r;
            }
      if (i + 1 < c[argsSym].length)
                res += ','
        }
        res += ')'
        return res;
    }

    let show = function(c) { return c[nameAritySym] +  showArgs(c) + '#' + c[idSym]; }

    // Constr.prototype.show = function () { return show(this); }

    Constr.prototype.toString = function() { return show(this); }

    let Constraint = {};

    Constraint.isConstraint = isConstraint;
    Constraint.clone = clone;

    Constraint.nameSym = nameSym;
    Constraint.aritySym = aritySym;
    Constraint.nameAritySym = nameAritySym;
    Constraint.argsSym = argsSym;
    Constraint.idSym = idSym;
    Constraint.aliveSym = aliveSym;

    Constraint.argKeySyms = argKeySyms;

    Constraint.setName = setName;
    Constraint.addArgs = addArgs;
    Constraint.id = id ;
    Constraint.name = name; 
    Constraint.nameArity = nameArity;
    Constraint.args = args; 
    Constraint.alive = alive;
    Constraint.obj = getObj;

    // Constraint.isAlive = isAlive;
    Constraint.allAlive = allAlive;

    Constraint.show = show;

    Constraint.remove = remove;

    Constraint.VERSION = version;

    Constraint.makeConstraint = makeConstraint;

    return Constraint;
}));

},{"./checks.js":"/checks.js","./var.js":"/var.js"}],"/index.js":[function(require,module,exports){
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Index = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let MIN_COUNT = 7;

    let Utils = require('./utils.js');
    let Var = require('./var.js');
    let Constraint = require('./constraint.js');

	let Index = function(store) {
		this.indexes = mkIdx();
		this.varIndexes = mkIdx();
	} 

	let mkIdx = function() {
		return {};
	}

	Index.prototype.ensureIxs = function(na,len=0) {
		if (!this.indexes[na]) {
			this.indexes[na] = mkIdx();
			this.varIndexes[na] = mkIdx();
			for (let i = 0; i < len; i++) {
				this.indexes[na][i] = {};
				this.varIndexes[na][i] = [];
			}
		}	
	}

	Index.prototype.add = function(na,i,k,ikey) {
		let idxs = this.indexes[na][i];

		let idx = idxs[k];
		if (!idx) {
			idx = [];
			idxs[k] = idx;
		}

	    Utils.binaryInsert(idx,ikey)
		return true;
	}

	Index.prototype.addVar = function(na,i,ikey) {
		let arr = this.varIndexes[na][i];

	    Utils.binaryInsert(arr,ikey)
	    return true;
	}


	Index.prototype.remove = function(na,i,k,ikey) {
		let idxs = this.indexes[na];
		if (!idxs)
			return;
		if (i in idxs) {
			let idx = idxs[i][k]; 
			if (idx)  {
				// Utils.binaryRemove(idx,ikey);
				let ix = idx.indexOf(ikey);
				if (ix >= 0) {
					idx.splice(ix,1);
				}
			}
		}
	}

	Index.prototype.removeVar = function(na,i,ikey) {
		let idxs = this.varIndexes[na];
		if (!idxs)
			return;
		if (i in idxs) {
			let idx = idxs[i];
			if (idx)  {
				// Utils.binaryRemove(idx,ikey);
				let ix = idx.indexOf(ikey);
				if (ix >= 0) {
					idx.splice(ix,1);
				}
			}
		}
	}


	let noit = { next: function() {} };


		// let fexcl = function(n) { return excl[n] === undefined }


	Index.prototype.select = function(na,ifs,keys,items,excl) {
		excl = excl || {};

		if (!keys.length)
			return {next:function() {}, all:function() { return []; }, remove: function() {} };

		let idxs = this.indexes[na];
		if (!idxs) {
			// return Utils.iterExcl(keys,excl);
			return;
		}

		let vidxs = this.varIndexes[na];

		let its = [];
		let ifslen = ifs.length;
		for (let j = 0; j < ifslen; j++) {
			let f = ifs[j].f;
			if (!f)
				continue;
			let i = ifs[j].i;
			let idxi = idxs[i];
			let vidxi = vidxs[i];

			let it, vit;
			if (idxi) {
				it = f(idxi,i,na,keys,items);
			}

			if (it) {
				if (vidxi.length == 0)
					its.push(it);
				else {
					let vit = Utils.iter(vidxi);
					let i = it.next();
					let j = vit.next();
					let cur;
					//  = i;
					// if (j !== undefined) 
					// 	if (i !== undefined && j < i)
					// 		cur = j;
					its.push({
						next: function() {
							if (i !== undefined) { 
								if (j !== undefined && j < i) {
									cur = j;
									j = vit.next();
								}
								else {
									cur = i;
									i = it.next();
								}
								return cur;
							}
							else {
								if (j !== undefined) {
									cur = j;
									j = vit.next();
									return cur;
								}
							}
						}
					});
				}
			}
		}

		if (its.length === 0) {
			return;
			// return Utils.iterExcl(keys,excl);

		}

		if (its.length === 1) {
			return { 
				next:function() {
					let cur = its[0].next();
					while (cur !== undefined && excl[cur] !== undefined)
						cur = its[0].next();
					return cur;
				}
			}
		}


		let arr = [];
		for (let i = 1; i < its.length; i++) {
			let n = its[i].next();
			if (n === undefined)
				return noit;
			arr[i] = n;
		}

		return {
			next:function() {

				let cur = its[0].next();
				
				while (cur !== undefined) {
					if (excl[cur] !== undefined) {
						cur = its[0].next();
						continue;				
					}
					let eq = true;
					for (let i = 1; eq && i < its.length; i++) {
						let n = arr[i];
						while (n < cur) {
							n = its[i].next();
							if (n === undefined)
								return;
						}
						arr[i] = n;
						eq = (arr[i] == cur);
					}

					if (eq)
						return cur;
					else  {
						cur = its[0].next();
						while (cur < arr[1])
							cur = its[0].next();
					}

				}
			}
		};
	}

	let rettrue = function() { return true; };

	let eq = function(v) { 
		if (v == undefined)
			return null;
		let vg = Var.get(v);
		if (vg === undefined)
			return null;
		return function(idx) { return Utils.iter(idx[v]); } };               

	let neq = function(v) { // return null; }
		if (v == undefined)
			return null;
		let vg = Var.get(v);
		if (vg === undefined)
			return null;
		return  function(idx,argi,na,keys) { 
			if (idx[vg] === undefined)
				return Utils.iter(keys);
			return Utils.iterExcl(keys,idx[vg]); }
			// return Utils.iterExcl(keys,null,function(n) { return idx[vg][n] === undefined }); }
	};               

	let comp = function(f,v) { // return null; }
		if (v == undefined)
			return null;
		let vg = Var.get(v);
		return  vg === undefined ? null : function(idx,argi,na,keys,items) {
			return Utils.iterExcl(keys,function(n) { 
				return items[n] ? f(items[n][Constraint.argsSym][argi],v) : undefined; 
			});
		}
	};

	let lt = function(v) { return comp(function(a,b) { return a < b; },v); };

	// let lt = function(v) { 
	// 	if (v == undefined)
	// 		return null;
	// 	let vg = Var.get(v);
	// 	return  vg === undefined ? null : function(idx,argi,na,keys,items) {
	// 			let bs = Object.keys(idx);
	// 			let found = Utils.binaryIndexOf(bs,v);
	// 			if (found < 0)
	// 				found = -found;
	// 			found++
	// 			let len = found;
	// 			let i = 0;
	// 			return {
	// 				next: function() {
	// 					while (i < len) {
	// 						let k = bs[i++];
	// 						if (k < v)
	// 							return k;
	// 					}
	// 				}
	// 			}

	// 		// 	let ks = 
	// 		// return Utils.iterExcl(keys,function(n) { 
	// 		// 	return items[n] ? items[n].args[argi] < v : false; 
	// 		// });
	// 	}
	// };



	let lte = function(v) { return comp(function(a,b) { return a <= b; },v); };
	let gt = function(v) { return comp(function(a,b) { return a > b; },v); };
	let gte = function(v) { return comp(function(a,b) { return a >= b; },v); };

	Index.eq = eq;
	Index.neq = neq;
	Index.lt = lt; 
	Index.lte = lte;
	Index.gt = gt; 
	Index.gte = gte; 

	Index.MIN_COUNT = MIN_COUNT;

	// Index.VARREF = VARREF;
	Index.VERSION = version;

	return Index;
}));



},{"./constraint.js":"/constraint.js","./utils.js":"/utils.js","./var.js":"/var.js"}],"/match.js":[function(require,module,exports){
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    }/* else {
        root.Match = factory();
    }*/
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let Checks = require('./checks.js');
    let Var = require('./var.js');
    let VarRef = require('./varref.js');


    let Waiter = function(f) {
      this.count = 0;
      this.zeroWaitFunc = f;
    }

    Waiter.prototype.incr = function(n) {
      n = n || 1;
      this.count += n;
    }

    Waiter.prototype.decr = function() {
      this.count--;
      if (this.zeroWaitFunc && this.count == 0) {
        this.zeroWaitFunc();
        this.zeroWaitFunc = null;
      }
    }

    Waiter.prototype.setZeroWait = function(f) {
      if (this.count == 0)
        f && f();
      else 
        this.zeroWaitFunc = f;
    }

    Waiter.prototype.fail = function() {
      this.failed = true;
      this.zeroWaitFunc = null;
    }



    let eqf = function(a,b) { return a === b; };
    let match = function(a,b,varrefs=[],fsucc,fail) { return matchBy(a,b,eqf,varrefs,fsucc,fail); }


    let matchKey = Symbol('match');
    // let matchKey = '_$match';


    let derefWait = function(v,varrefs,f) { Var.wait(VarRef.deref(v,varrefs),f); }

    let derefWaitAll = function(vs,varrefs,f) { return Var.all(VarRef.derefAll(vs,varrefs), f); }

    let matchBy = function(a,b,eq,varrefs=[],fsucc,fail) { 

      let rv = new Var();
      a = Var.deref(a);

      let succ = (fsucc === undefined) ? function() {
        a = Var.deref(VarRef.deref(a,varrefs));
        rv.set(a); } : function() { fsucc(a); rv.set(a); };

      let waiter = new Waiter(succ)
      let ffail = function() { 
        waiter.fail(); 
        fail && fail();
      }

      waiter.incr();
      if (a == null) { // null of undefined
        if (!eq(a,b))
          ffail();
        else if (b != null) // could be a var
          b[matchKey](a,eq,varrefs,waiter,ffail);
      }
      else {
        a[matchKey](b,eq,varrefs,waiter,ffail);        
      } 
      waiter.decr();

      return rv;
    }


    // let nomatch = function(a,b,varrefs,fsucc,fail) { return nomatchBy(a,b,eqf,varrefs,fsucc,fail); }

    // let nomatchBy = function(a,b,eqf,varrefs=[],fsucc,fail) { 

    //   let rv = new Var();

    //   let succ = (fsucc === undefined) ? function() { 
    //     a = Var.deref(VarRef.deref(a,varrefs));
    //     b = Var.deref(VarRef.deref(b,varrefs));
    //     rv.set([a,b]); } : function() { fsucc(a,b); rv.set([a,b]); };

    //   let waiter;

    //   let ffail = function() { 
    //     a = Var.deref(a);
    //     b = Var.deref(b);
    //     waiter.setZeroWait(null); 
    //     fail && fail(a,b);
    //   }

    //   waiter = new Waiter(ffail);

    //   waiter.incr();
    //   if (a == null) { // null of undefined
    //     if (eq(a,b))
    //       ffail();
    //     else if (b != null) // could be a var
    //       b[matchKey](a,eq,varrefs,waiter,succ);
    //   else {
    //     a[matchKey](b,eq,varrefs,waiter,succ);        
    //   } 
    //   // a[matchKey](b,eqf,varrefs,waiter,succ);
    //   waiter.decr();

    //   return rv;
    // }


    VarRef.prototype[matchKey] = function(o,eq,varrefs,waiter,fail) {
      if (o && o.constructor === VarRef && this.get() === o.get())
        return true;
      let i = this.get();
      let v = varrefs[i];
      if (v === undefined) {
        varrefs[i] = o;
      }
      else {
        return v[matchKey](o,eq,varrefs,waiter,fail);
      }
    }


    Var.prototype[matchKey] = function(o,eq,varrefs,waiter,fail) {
      if (this === o)
        return true;
      if (o && o.constructor === VarRef && this === varrefs[o.get()])
        return true;
      let v = this.get();
      if (v === undefined) {
        waiter.incr();
        this.wait(function(v) {
          if (o && o.constructor === VarRef) {
            let i = o.get();
            let ref = varrefs[i];
            if (ref === undefined) {
              varrefs[i] = v;
            }
            else {
              v[matchKey](ref,eq,varrefs,waiter,fail);
            }
          }
          else {
            let ov = Var.get(o);
            if (ov === Var.NOVALUE) {
              waiter.incr();
              o.wait(function(ov) {
                v[matchKey](ov,eq,varrefs,waiter,fail);
                waiter.decr();
              });
            }
            else {
              v[matchKey](ov,eq,varrefs,waiter,fail);
            }
          }
          waiter.decr();
        });
      }
      else {
        return v[matchKey](o,eq,varrefs,waiter,fail);
      }
    }

    let typeMatch = function(self,o,eq,varrefs,waiter,fail,neqFail) {
      if (o && o.constructor === VarRef) {
        let i = o.get();
        o = varrefs[i]; 
        if (o === undefined) {
          varrefs[i] = self;
          return;
        }
      }
      let ov = Var.get(o);
      if (ov === Var.NOVALUE) {
        waiter.incr();
        o.wait(function(ov) {
          neqFail(self,ov);
          waiter.decr();
        });
      }
      else 
        neqFail(self,ov);
    }

    let baseTypeMatch = function(o,eq,varrefs,waiter,fail) {
      typeMatch(this,o,eq,varrefs,waiter,fail,function(self,ov) {
        if (!eq(self,ov))
          fail && fail();
      });
    }

    Boolean.prototype[matchKey] = baseTypeMatch
    Number.prototype[matchKey] = baseTypeMatch
    String.prototype[matchKey] = baseTypeMatch // localeCompare ?

    Array.prototype[matchKey] = function(o,eq,varrefs,waiter,fail) {
      typeMatch(this,o,eq,varrefs,waiter,fail,function(self,ov) {
        if (ov === self) {
            return;
        }
        else if (Array.isArray(ov)) {
          if (self.length !== ov.length)
            fail && fail();
          else {
            for (let i = 0; i < ov.length; i++) {
              if (waiter.failed)
                return;
              if (self[i] == null) { // null or undefined;
                if (ov[i] !== self[i])
                  fail && fail();
              }
              else 
                self[i][matchKey](ov[i],eq,varrefs,waiter,fail);
            }
          }
        }
        else 
          fail && fail();
      });
    }

    Object.prototype[matchKey] = function(o,eq,varrefs,waiter,fail) {
      typeMatch(this,o,eq,varrefs,waiter,fail,function(self,ov) {
        if (ov === self) {
            return;
        }
        else if (Checks.isObject(ov)) {
          // let matchCount = 0;
          for (let k in ov) {
            if (waiter.failed)
              return;
            if (ov.hasOwnProperty(k)) {
              if (self[k] == null) { // null or undefined;
                if (ov[k] !== self[k])
                  fail && fail();
              }
              else {
                self[k][matchKey](ov[k],eq,varrefs,waiter,fail)
              }
            }
          }
        }
        else 
          fail && fail();
      });
    }

    let Match = {
      match: match,
      matchBy: matchBy,
      // nomatch: nomatch,
      // nomatchBy: nomatchBy,
      VarRef: VarRef,
      derefAll:VarRef.derefAll,
      derefWait:derefWait,
      derefWaitAll:derefWaitAll
    }

    Match.VERSION = version;

    return Match;
}));



},{"./checks.js":"/checks.js","./var.js":"/var.js","./varref.js":"/varref.js"}],"/store.js":[function(require,module,exports){
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


},{"./constraint.js":"/constraint.js","./index.js":"/index.js","./utils.js":"/utils.js","./var.js":"/var.js"}],"/utils.js":[function(require,module,exports){
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

    let randomhex = function() {
        return Math.random().toString(16).slice(2);
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
        randomhex:randomhex,
		log: log,
		VERSION: version
	}

	return Utils;
}));


},{"./checks.js":"/checks.js","./var.js":"/var.js"}],"/var.js":[function(require,module,exports){
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Var = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

	let lastID = -1;
	let newID = function newID() {
	  return ++lastID;
	}

    let NoValue = Symbol('Var.NoValue');

	let Var = function(f) {
		this.value = NoValue;
	  	this.onSetArr = f ? [f] : [];
	} 

    Var.NOVALUE = NoValue;


	// let isVar = function(v) { return v !== undefined && v.constructor === Var; }
	let isVar = function(v) { return v instanceof Var; }
	let emptyVar = function(v) { return (v instanceof Var) && v.get() !== NoValue; } 

	let isSet = function(v) { return Var.get(v) !== NoValue; }
	Var.prototype.isSet = function() { return this.get() !== NoValue; }

	Var.prototype.valueOf = function() { return this.value !== NoValue ? this.value : this; }

	Var.prototype.set = function(v) { 
		if (this.value === NoValue) {
			this.value = v;
			let arr = this.onSetArr;
			this.onSetArr = undefined;
			arr.map(function(f) { f(v); });
		}
	}

	Var.prototype.setApply = function(v) { 
		if (this.value === NoValue) {
			this.value = v;
			let arr = this.onSetArr;
			this.onSetArr = undefined;
			arr.map(function(f) { f.apply(null,v); });
		}
	}

	let set = function(v,val) {
		if (isVar(v))
			v.set(val);
	}


	Var.prototype.resolve = Var.prototype.get;



	// let get = function(v) { return (v.constructor !== Var) ? v : v.get(); } 
	let get = function(v) { return (v instanceof Var) ? v.get() : v; } 
	let deref = function(v) { return (v instanceof Var && v.value !== NoValue) ? v.value : v; } 

	Var.prototype.get = function() { return this.value; }
	Var.prototype.deref = function() { return (this.value !== NoValue) ? this.value : this; } 


	let wait = function(v,f) {
		if (f) {
			let vg = get(v);
			if (vg !== NoValue) {
				return f(vg);
			}
			v.onSet(f);
		}
		return v;
	}


	Var.prototype.wait = function(f) {
		if (f) {
			let v = this.get();
			if (v !== NoValue) {
				return f(v);
			}
			this.onSet(f);
		}
		return this;
	}

	let waitApply = function(v,f) {
		if (f) {
			let ff = function(v) { 
				if (Array.isArray(v))
					return f.apply(null,v);
				return f(v);
			}
			return wait(v,ff);
		}
		return v;
	}

	Var.prototype.waitApply = function(f) {
		if (f) {
			let ff = function(v) { 
				if (Array.isArray(v))
					return f.apply(null,v);
				return f(v);
			}
			return this.wait(ff);
		}
		return this;
	}


	Var.prototype.unwait = function() {
		this.onSetArr = [];
		return this;
	}

	Var.prototype.onSet = function(f) { this.value !== NoValue ? f(this.value) : this.onSetArr.push(f); }


	Var.prototype.show = function() {
		if (!this.id)
			this.id = newID();
		let res = 'Var(id:' + this.id;

		if (this.value && this.value !== NoValue)
			res += ', value:' + this.value;

		res += ")";

		return res;
	}

	Var.prototype.toString = function() { return this.show(); }



	let check = function(vs,match,f,fail) { return checkInj(vs,match,f,fail).var; }

	let checkInj = function(vs,match,f,fail) {
		let count = vs.length;
		let arr = new Array(count);
		let fired = false;

		let rv = new Var();
		if (f === undefined) {
			f = rv.set.bind(rv);
		}
		else {
			let ref = f;
			// rv.onSet(f);
			f = function(val) { ref(val); rv.set(val); };
		}

		let addWait;

		let doFail = function() {
			fired = true;
			fail && fail(vs);
		}

		if (count === 0) 
			f([]);
		else {
			addWait = function(v,i) {
				Var.wait(v,function(val) {
					if (fired)
						return;
					let res = match(val,arr,i);
					if (!res) {
						doFail();
					}
					arr[i] = val;
					if (--count <= 0) {
						fired = true;
						f(arr);
					}
				});
			};
			vs.forEach(function(v,i) {
				addWait(v,i);
			});
		}
		let inj = function(v) { 
			if (!fired) {
				vs.push(v);
				let i = count++; 
				addWait(v,i);
				return vs;
			} 
		}

		return {inj: inj, 'var': rv, fail: doFail };
	}


	let all = function(vs,f) { return check(vs,function() { return true; }, f) };

	let allInj = function(vs,f) { return checkInj(vs,function() { return true; }, f) };

	let one = function(vs,f) { return oneInj(vs,f).var; }

	let oneInj = function(vs,f) {
		let count = vs.length;
		let v = new Var();

		let rv = new Var();
		if (f === undefined) {
			f = rv.set.bind(rv);
		}
		else {
			let ref = f;
			// f = function(val) { rv.set(ref(val)); };
			// rv.onSet(f);
			f = function(val,i) { ref(val,i); rv.set(val); };
		}

		let fired;

		let addWait = function(v,i) {
			Var.wait(v,function(val) {
				if (!fired) {
					fired = true;
					f(val,i);
				}
			})
		}

		if (count > 0) {
			fired = false;
			vs.forEach(function(v,i) { addWait(v,i); });
		}

		let inj = function(v) {
			if (!fired) {
				vs.push(v);
				let i = count++; 
				addWait(v,i);
				return vs;
			}
		} 
		return { inj:inj, var:rv };
	}


	let reduce = function(vs,red,initial,f) {
		let count = vs.length;

		let rv = new Var();
		if (f === undefined) {
			f = rv.set.bind(rv);
		}
		else {
			let ref = f;
			f = function(val) { rv.set(ref(val)); };
		}

		if (count !== 0) {
			vs.forEach(function(v,i) {
				Var.wait(v,function(val) {
					initial = red(initial,val,i,vs);
					if (initial !== undefined && --count <= 0)
						f(initial);
				})
			});
		}

		return rv;
	}


	let equal = function(vs,succ,fail) { return equalBy(vs,function(a,b) { return a === b; },succ,fail); };

	let equalBy = function(vs,eq,succ,fail) {
		let init;
		return check(vs, function(val/*,arr,i*/) {
				if (init === undefined) {
					init = val;
					return true;
				}
				return eq(val,init);
			},succ,fail);
	}


	let disj = function(vs,succ,fail) { return disjBy(vs, function (a,b) { return a === b; }, succ, fail); }

	let disjBy = function(vs,eq,succ,fail) { 
		return check(vs, function(val,arr,ix) {
			let len = arr.length;
		    for (let i = 0; i < len; i++) {
		    	if (ix != i) {
		        let v = arr[i];
		        if (v && eq(v,val))
		           return false;
		    	}
		    }
		    return true;
			},succ,fail);
	}



	Var.VERSION = version;
	Var.isVar = isVar;
	Var.isSet = isSet;
	Var.get = get;
	Var.deref = deref;
	Var.set = set;

	Var.wait = wait;
	Var.waitApply = waitApply;

	Var.check = check;
	Var.checkInj = checkInj;

	Var.all = all;
	Var.allInj = allInj;
	Var.one = one;
	Var.oneInj = oneInj;

	Var.race = one;
	Var.reduce = reduce;

	Var.equal = equal;
	Var.equalBy = equalBy;

	Var.disj = disj;
	Var.disjBy = disjBy;

	return Var;
}));






},{}],"/varref.js":[function(require,module,exports){
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    }/* else {
        root.Match = factory();
    }*/
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let VarRef = function(i) {
      this.i = i;
    }

    VarRef.prototype.get = function() { return this.i; } 

    let derefAll = function(vs,varrefs,cont) {
      let arr = vs.map(v => deref(v,varrefs));
      if (cont)
        cont.apply(null,arr);
      else 
        return arr;
    } 

    let deref = function(v,varrefs,cont) {
      let r = (v != null && v.constructor === VarRef) ? varrefs[v.get()] : v;
      if (cont)
        cont(r);
      else
        return r;
    }


    VarRef.deref = deref;
    VarRef.derefAll = derefAll;

    VarRef.VERSION = version;

    return VarRef;
}));



},{}]},{},[]);

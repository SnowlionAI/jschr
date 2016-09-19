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
		// let res = 'Var(id:' + this.id;
		let res = 'Var(id:' + this.id;
		// if (this.name)
		// 	res += ', name:' + this.name; 

		if (this.value && this.value !== NoValue)
			res += ', value:' + this.value;

		// let len = this.onSetArr ? this.onSetArr.length : 0;
		// res += ', onSetArrLength:' + len;

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






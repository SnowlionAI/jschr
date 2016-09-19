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
				return items[n] ? f(items[n].args[argi],v) : undefined; 
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



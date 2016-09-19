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



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



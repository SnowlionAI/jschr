
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

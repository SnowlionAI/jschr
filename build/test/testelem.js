// This file is generated: DO NOT CHANGE!
// Changes will be overwritten...

((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.TestElem = factory();
    }
})(this, () => {
    'use strict';
    let Constraint = require('/constraint.js');
    let Var = require('/var.js');
    let Index = require('/index.js');
    let Match = require('/match.js');
    let Utils = require('/utils.js');
    let version = '0.0.1';
    let testCHRCode = (chr, module, resolve, base, modname) => {
        let pointedname = modname ? modname + '.' : '';
        let modA = pointedname + 'a';
        let modA$0 = modA + '/0';
        let test;
        (() => {
            let guard = () => {
                return console.log('x', x);
            };
            let _body = () => {
                var a = new Var(), b = new Var();
                chr.cont(() => {
                    module.a();
                });
            };
        })();
    };
    let init = (chr, modname = 'TestElem', base) => {
        if (base === undefined) {
            chr.Modules = chr.Modules || {};
            base = chr.Modules;
        }
        base.module = base.module || {};
        base.resolve = base.resolve || {};
        base.module[modname] = base.module[modname] || {};
        let mod = base.module[modname];
        base.resolve[modname] = base.resolve[modname] || {};
        let res = base.resolve[modname];
        let temp = {};
        temp.a = temp.a || function () {
            chr.add(modname + '.a', arguments);
        };
        for (let i in temp) {
            let f = temp[i];
            mod[i] = mod[i] || f;
            res[i] = function () {
                let fres = () => {
                    f.apply('null', arguments);
                };
                chr.resolveOne(fres);
            };
        }
        testCHRCode(chr, mod, res, base, modname);
        return base;
    };
    let TestElem = {};
    TestElem.VERSION = version;
    TestElem.init = init;
    return TestElem;
});
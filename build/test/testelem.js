((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Test = factory();
    }
})(this, () => {
    'use strict';
    let version = '0.0.1';
    let fib = (chr, module, resolve, modbase, modname) => {
        let pointedname = modname ? modname + '.' : '';
        let modUpto = pointedname + 'upto';
        let modUpto$1 = modUpto + '/1';
        let modFib = pointedname + 'fib';
        let modFib$2 = modFib + '/2';
        (() => {
            let body = () => {
                chr.cont([
                    () => {
                        chr.add(modFib, [
                            1,
                            1
                        ]);
                    },
                    () => {
                        chr.add(modFib, [
                            0,
                            0
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modUpto$1, [new Var()], upto => {
                let varrefs0 = [];
                let _N = upto.args[0];
                if (Constraint.allAlive([upto])) {
                    body();
                }
            });
        })();
        (() => {
            let guard = (N, Nr, Max) => {
                return N == Nr + 1 && Nr < Max;
            };
            let body = (N, M, Mr) => {
                chr.cont(() => {
                    chr.add(modFib, [
                        N + 1,
                        M + Mr
                    ]);
                });
            };
            chr.addConstraintListener(modFib$2, [
                new Var(),
                new Var()
            ], fib2 => {
                if (chr.has(modUpto$1, 1) && chr.has(modFib$2, 2)) {
                    let varrefs0 = [];
                    Var.all([
                        fib2.args[0],
                        fib2.args[1]
                    ]).waitApply((Nr, Mr) => {
                        chr.select(modUpto$1, { 'check': Constraint.alive }, upto => {
                            let varrefs1 = varrefs0.slice();
                            let $cont = true;
                            Var.wait(upto.args[0], Max => {
                                let excl = {};
                                excl[fib2.id] = true;
                                chr.select(modFib$2, { 'check': Constraint.alive }, excl, fib1 => {
                                    let varrefs2 = varrefs1.slice();
                                    Var.all([
                                        fib1.args[0],
                                        fib1.args[1]
                                    ]).waitApply((N, M) => {
                                        if (Constraint.allAlive([
                                                upto,
                                                fib1,
                                                fib2
                                            ])) {
                                            if (guard(N, Nr, Max)) {
                                                chr.remove(fib2);
                                                $cont = false;
                                                body(N, M, Mr);
                                            }
                                        }
                                    });
                                    return $cont;
                                });
                            });
                            return $cont;
                        });
                    });
                }
            });
            chr.addConstraintListener(modUpto$1, [new Var()], upto => {
                if (chr.has(modFib$2, 2)) {
                    let varrefs0 = [];
                    Var.wait(upto.args[0], Max => {
                        chr.select(modFib$2, { 'check': Constraint.alive }, fib2 => {
                            let varrefs1 = varrefs0.slice();
                            Var.all([
                                fib2.args[0],
                                fib2.args[1]
                            ]).waitApply((Nr, Mr) => {
                                let excl = {};
                                excl[fib2.id] = true;
                                chr.select(modFib$2, { 'check': Constraint.alive }, excl, fib1 => {
                                    let varrefs2 = varrefs1.slice();
                                    let $cont = true;
                                    Var.all([
                                        fib1.args[0],
                                        fib1.args[1]
                                    ]).waitApply((N, M) => {
                                        if (Constraint.allAlive([
                                                upto,
                                                fib1,
                                                fib2
                                            ])) {
                                            if (guard(N, Nr, Max)) {
                                                chr.remove(fib2);
                                                $cont = false;
                                                body(N, M, Mr);
                                            }
                                        }
                                    });
                                    return $cont;
                                });
                            });
                            return true;
                        });
                    });
                }
            });
            chr.addConstraintListener(modFib$2, [
                new Var(),
                new Var()
            ], fib1 => {
                if (chr.has(modUpto$1, 1) && chr.has(modFib$2, 2)) {
                    let varrefs0 = [];
                    Var.all([
                        fib1.args[0],
                        fib1.args[1]
                    ]).waitApply((N, M) => {
                        let excl = {};
                        excl[fib1.id] = true;
                        chr.select(modFib$2, { 'check': Constraint.alive }, excl, fib2 => {
                            let varrefs1 = varrefs0.slice();
                            Var.all([
                                fib2.args[0],
                                fib2.args[1]
                            ]).waitApply((Nr, Mr) => {
                                chr.select(modUpto$1, { 'check': Constraint.alive }, upto => {
                                    let varrefs2 = varrefs1.slice();
                                    let $cont = true;
                                    Var.wait(upto.args[0], Max => {
                                        if (Constraint.allAlive([
                                                upto,
                                                fib1,
                                                fib2
                                            ])) {
                                            if (guard(N, Nr, Max)) {
                                                chr.remove(fib2);
                                                $cont = false;
                                                body(N, M, Mr);
                                            }
                                        }
                                    });
                                    return $cont;
                                });
                            });
                            return true;
                        });
                    });
                }
            });
        })();
    };
    let init = (chr, modbase, modname = 'Test') => {
        let mod;
        if (modbase === undefined) {
            chr.Modules = chr.Modules || {};
            modbase = chr.Modules;
        }
        modbase[modname] = modbase[modname] || {};
        mod = modbase[modname];
        let temp = {};
        temp.upto = temp.upto || function () {
            chr.addConstraint(modname + '.upto', arguments);
        };
        temp.fib = temp.fib || function () {
            chr.addConstraint(modname + '.fib', arguments);
        };
        let res = {};
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
        fib(chr, mod, res, modbase, modname);
        return {
            base: modbase,
            module: mod,
            resolve: res,
            modname: modname
        };
    };
    let Test = {};
    Test.VERSION = version;
    Test.init = init;
    return Test;
});
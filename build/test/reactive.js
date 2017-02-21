// This file is generated: DO NOT CHANGE!
// Changes will be overwritten...

((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Reactive = factory();
    }
})(this, () => {
    'use strict';
    let Constraint = require('/constraint.js');
    let Var = require('/var.js');
    let Index = require('/index.js');
    let Match = require('/match.js');
    let Utils = require('/utils.js');
    let version = '0.0.1';
    let reactive = (chr, module, resolve, base, modname) => {
        let pointedname = modname ? modname + '.' : '';
        let modStream = pointedname + 'stream';
        let modStream$1 = modStream + '/1';
        let modStream$2 = modStream + '/2';
        let modRemoveInput = pointedname + 'removeInput';
        let modRemoveInput$1 = modRemoveInput + '/1';
        let modInput = pointedname + 'input';
        let modInput$3 = modInput + '/3';
        let modHandleEvent = pointedname + 'handleEvent';
        let modHandleEvent$1 = modHandleEvent + '/1';
        let modHandleEvent$3 = modHandleEvent + '/3';
        let modEvent = pointedname + 'event';
        let modEvent$2 = modEvent + '/2';
        let modOnce = pointedname + 'once';
        let modOnce$1 = modOnce + '/1';
        let modEvent$3 = modEvent + '/3';
        let modMouseOutDiv = pointedname + 'mouseOutDiv';
        let modMouseOutDiv$1 = modMouseOutDiv + '/1';
        let modHandleMouseMove = pointedname + 'handleMouseMove';
        let modHandleMouseMove$1 = modHandleMouseMove + '/1';
        let modMousemove = pointedname + 'mousemove';
        let modMousemove$2 = modMousemove + '/2';
        let modInit = pointedname + 'init';
        let modInit$0 = modInit + '/0';
        let outputContainer = document.getElementById('outputContainer');
        let codeselect = document.getElementById('codeselect');
        let eqArgs = function (n, c1, c2) {
            return Constraint.args(c1, 0) === Constraint.args(c2, 0);
        };
        let appendDivText = function (t, bold) {
            let d = document.createElement('div');
            if (bold)
                d.style.fontWeight = 'bold';
            d.appendChild(document.createTextNode(t));
            let output = document.getElementById('outputContainer');
            output.appendChild(d);
        };
        (() => {
            let _body = c => {
                chr.cont([
                    () => {
                        chr.call(c);
                    },
                    () => {
                        chr.remove(Constraint.nameArity(c));
                    }
                ]);
            };
            chr.addConstraintListener(modStream$1, [new Var()], stream => {
                let varrefs0 = [];
                let c = stream._$0;
                if (Constraint.allAlive([stream])) {
                    chr.remove(stream);
                    _body(c);
                }
            });
        })();
        (() => {
            let guard = rem => {
                return Constraint.isConstraint(rem);
            };
            let _body = (rem, c) => {
                chr.cont([
                    () => {
                        chr.call(c);
                    },
                    () => {
                        chr.call(rem);
                    }
                ]);
            };
            chr.addConstraintListener(modStream$2, [
                new Var(),
                new Var()
            ], stream => {
                let varrefs0 = [];
                let c = stream._$0;
                Var.wait(stream._$1, rem => {
                    if (Constraint.allAlive([stream])) {
                        if (guard(rem)) {
                            chr.remove(stream);
                            _body(rem, c);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = n => {
                return n.constructor === Number;
            };
            let _body = (c, n) => {
                chr.cont([
                    () => {
                        chr.call(c);
                    },
                    () => {
                        chr.remove(Constraint.nameArity(c), eqArgs.bind(null, n, c));
                    }
                ]);
            };
            chr.addConstraintListener(modStream$2, [
                new Var(),
                new Var()
            ], stream => {
                let varrefs0 = [];
                let c = stream._$0;
                Var.wait(stream._$1, n => {
                    if (Constraint.allAlive([stream])) {
                        if (guard(n)) {
                            chr.remove(stream);
                            _body(c, n);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = f => {
                return f.constructor === Function;
            };
            let _body = (c, f) => {
                chr.cont([
                    () => {
                        chr.call(c);
                    },
                    () => {
                        chr.remove(Constraint.nameArity(c), f);
                    }
                ]);
            };
            chr.addConstraintListener(modStream$2, [
                new Var(),
                new Var()
            ], stream => {
                let varrefs0 = [];
                let c = stream._$0;
                Var.wait(stream._$1, f => {
                    if (Constraint.allAlive([stream])) {
                        if (guard(f)) {
                            chr.remove(stream);
                            _body(c, f);
                        }
                    }
                });
            });
        })();
        (() => {
            chr.addConstraintListener(modInput$3, [
                new Var(),
                new Var(),
                new Var()
            ], input => {
                if (chr.has(modRemoveInput$1, 1)) {
                    let varrefs0 = [];
                    let id = input._$0;
                    chr.select(modRemoveInput$1, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(id)
                            }]
                    }, removeInput => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        Match.match(id, removeInput._$0, varrefs1).wait(id => {
                            if (Constraint.allAlive([
                                    removeInput,
                                    input
                                ])) {
                                chr.remove(input);
                                $cont = false;
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modRemoveInput$1, [new Var()], removeInput => {
                if (chr.has(modInput$3, 1)) {
                    let varrefs0 = [];
                    let id = removeInput._$0;
                    chr.select(modInput$3, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(id)
                            }]
                    }, input => {
                        let varrefs1 = varrefs0.slice();
                        Match.match(id, input._$0, varrefs1).wait(id => {
                            if (Constraint.allAlive([
                                    removeInput,
                                    input
                                ])) {
                                chr.remove(input);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        (() => {
            chr.addConstraintListener(modRemoveInput$1, [new Var()], removeInput => {
                let varrefs0 = [];
                let id = removeInput._$0;
                if (Constraint.allAlive([removeInput])) {
                    chr.remove(removeInput);
                }
            });
        })();
        (() => {
            let _body = (out, coords) => {
                chr.cont(() => {
                    out.innerHTML = JSON.stringify(coords);
                });
            };
            chr.addConstraintListener(modInput$3, [
                'mm',
                new Var(),
                new Var()
            ], input => {
                let varrefs0 = [];
                let out = input._$1;
                Var.wait(input._$2, coords => {
                    Match.match(input._$0, 'mm', varrefs0).wait(_ => {
                        if (Constraint.allAlive([input])) {
                            chr.remove(input);
                            _body(out, coords);
                        }
                    });
                });
            });
        })();
        (() => {
            let _body = (id, type, value) => {
                chr.cont(() => {
                    appendDivText('id:' + id + ' type:' + type + ' value:' + JSON.stringify(value));
                });
            };
            chr.addConstraintListener(modInput$3, [
                new Var(),
                new Var(),
                new Var()
            ], input => {
                let varrefs0 = [];
                Var.all([
                    input._$0,
                    input._$1,
                    input._$2
                ]).waitApply((id, type, value) => {
                    if (Constraint.allAlive([input])) {
                        _body(id, type, value);
                    }
                });
            });
        })();
        (() => {
            let _body = (value, value2) => {
                chr.cont(() => {
                    module.stream(Constraint.makeConstraint(modInput, [
                        'inpcs',
                        'combi',
                        {
                            inp: value,
                            codeselect: value2.value
                        }
                    ]), Constraint.makeConstraint(modRemoveInput, ['inpcs']));
                });
            };
            chr.addConstraintListener(modInput$3, [
                'inp',
                new Var(),
                new Var()
            ], input1 => {
                if (chr.has(modInput$3, 2)) {
                    let varrefs0 = [];
                    let type = input1._$1;
                    let value = input1._$2;
                    Match.match(input1._$0, 'inp', varrefs0).wait(_ => {
                        let excl = {};
                        excl[input1[Constraint.idSym]] = true;
                        chr.select(modInput$3, {
                            'check': Constraint.alive,
                            'index': [{
                                    'i': 0,
                                    'f': Index.eq('codeselect')
                                }]
                        }, excl, input2 => {
                            let varrefs1 = varrefs0.slice();
                            let value2 = input2._$2;
                            Match.match(input2._$0, 'codeselect', varrefs1).wait(_ => {
                                if (Constraint.allAlive([
                                        input1,
                                        input2
                                    ])) {
                                    _body(value, value2);
                                }
                            });
                            return true;
                        });
                    });
                }
            });
            chr.addConstraintListener(modInput$3, [
                'codeselect',
                new Var(),
                new Var()
            ], input2 => {
                if (chr.has(modInput$3, 2)) {
                    let varrefs0 = [];
                    let value2 = input2._$2;
                    Match.match(input2._$0, 'codeselect', varrefs0).wait(_ => {
                        let excl = {};
                        excl[input2[Constraint.idSym]] = true;
                        chr.select(modInput$3, {
                            'check': Constraint.alive,
                            'index': [{
                                    'i': 0,
                                    'f': Index.eq('inp')
                                }]
                        }, excl, input1 => {
                            let varrefs1 = varrefs0.slice();
                            let type = input1._$1;
                            let value = input1._$2;
                            Match.match(input1._$0, 'inp', varrefs1).wait(_ => {
                                if (Constraint.allAlive([
                                        input1,
                                        input2
                                    ])) {
                                    _body(value, value2);
                                }
                            });
                            return true;
                        });
                    });
                }
            });
        })();
        (() => {
            let _body = c => {
                chr.cont(() => {
                    module.stream(Constraint.makeConstraint(modInput, [
                        c.id,
                        'notask',
                        c.value
                    ]), Constraint.makeConstraint(modRemoveInput, [c.id]));
                });
            };
            chr.addConstraintListener(modHandleEvent$1, [new Var()], handleEvent => {
                let varrefs0 = [];
                let c = handleEvent._$0;
                if (Constraint.allAlive([handleEvent])) {
                    chr.remove(handleEvent);
                    _body(c);
                }
            });
        })();
        (() => {
            let _body = (i, t, v) => {
                chr.cont(() => {
                    module.stream(Constraint.makeConstraint(modInput, [
                        i,
                        t,
                        v
                    ]), Constraint.makeConstraint(modRemoveInput, [i]));
                });
            };
            chr.addConstraintListener(modHandleEvent$3, [
                new Var(),
                new Var(),
                new Var()
            ], handleEvent => {
                let varrefs0 = [];
                let i = handleEvent._$0;
                let t = handleEvent._$1;
                let v = handleEvent._$2;
                if (Constraint.allAlive([handleEvent])) {
                    chr.remove(handleEvent);
                    _body(i, t, v);
                }
            });
        })();
        (() => {
            let guard = i => {
                return i.id !== undefined;
            };
            let _body = (i, type) => {
                chr.cont(() => {
                    module.once(Constraint.makeConstraint(modEvent, [
                        i,
                        type,
                        i.id
                    ]));
                });
            };
            chr.addConstraintListener(modEvent$2, [
                new Var(),
                new Var()
            ], event => {
                let varrefs0 = [];
                let type = event._$1;
                Var.wait(event._$0, i => {
                    if (Constraint.allAlive([event])) {
                        if (guard(i)) {
                            _body(i, type);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = i => {
                return i.constructor.name === 'HTMLInputElement';
            };
            let _body = i => {
                chr.cont(() => {
                    i.oninput = function (e) {
                        resolve.handleEvent(CHR.makeConstraint(i));
                    };
                });
            };
            chr.addConstraintListener(modEvent$3, [
                new Var(),
                new Var(),
                new Var()
            ], event => {
                let varrefs0 = [];
                let type = event._$1;
                let id = event._$2;
                Var.wait(event._$0, i => {
                    if (Constraint.allAlive([event])) {
                        if (guard(i)) {
                            _body(i);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = i => {
                return i.constructor.name === 'HTMLSelectElement';
            };
            let _body = (i, id, type) => {
                chr.cont(() => {
                    i.onchange = function (e) {
                        resolve.handleEvent(id, type, {
                            i: i.selectedIndex,
                            value: i.value
                        });
                    };
                });
            };
            chr.addConstraintListener(modEvent$3, [
                new Var(),
                new Var(),
                new Var()
            ], event => {
                let varrefs0 = [];
                Var.all([
                    event._$0,
                    event._$1,
                    event._$2
                ]).waitApply((i, type, id) => {
                    if (Constraint.allAlive([event])) {
                        if (guard(i)) {
                            _body(i, id, type);
                        }
                    }
                });
            });
        })();
        (() => {
            let _body = (out, e) => {
                chr.cont(() => {
                    module.stream(Constraint.makeConstraint(modInput, [
                        'mm',
                        out,
                        {
                            x: e.clientX,
                            y: e.clientY,
                            sx: e.screenX,
                            sy: e.screenY
                        }
                    ]));
                });
            };
            chr.addConstraintListener(modHandleMouseMove$1, [new Var()], handleMouseMove => {
                if (chr.has(modMouseOutDiv$1, 1)) {
                    let varrefs0 = [];
                    let e = handleMouseMove._$0;
                    chr.select(modMouseOutDiv$1, { 'check': Constraint.alive }, mouseOutDiv => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let out = mouseOutDiv._$0;
                        if (Constraint.allAlive([
                                mouseOutDiv,
                                handleMouseMove
                            ])) {
                            chr.remove(handleMouseMove);
                            $cont = false;
                            _body(out, e);
                        }
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modMouseOutDiv$1, [new Var()], mouseOutDiv => {
                if (chr.has(modHandleMouseMove$1, 1)) {
                    let varrefs0 = [];
                    let out = mouseOutDiv._$0;
                    chr.select(modHandleMouseMove$1, { 'check': Constraint.alive }, handleMouseMove => {
                        let varrefs1 = varrefs0.slice();
                        let e = handleMouseMove._$0;
                        if (Constraint.allAlive([
                                mouseOutDiv,
                                handleMouseMove
                            ])) {
                            chr.remove(handleMouseMove);
                            _body(out, e);
                        }
                        return true;
                    });
                }
            });
        })();
        (() => {
            let _body = (out, e) => {
                chr.cont([
                    () => {
                        e.addEventListener('mousemove', function (e) {
                            resolve.handleMouseMove(e);
                        }, false);
                    },
                    () => {
                        module.mouseOutDiv(out);
                    }
                ]);
            };
            chr.addConstraintListener(modMousemove$2, [
                new Var(),
                new Var()
            ], mousemove => {
                let varrefs0 = [];
                let e = mousemove._$0;
                let out = mousemove._$1;
                if (Constraint.allAlive([mousemove])) {
                    _body(out, e);
                }
            });
        })();
        (() => {
            let _body = c => {
                chr.cont([
                    () => {
                        chr.remove(c);
                    },
                    () => {
                        chr.call(c);
                    }
                ]);
            };
            chr.addConstraintListener(modOnce$1, [new Var()], once => {
                let varrefs0 = [];
                let c = once._$0;
                if (Constraint.allAlive([once])) {
                    chr.remove(once);
                    _body(c);
                }
            });
        })();
        let body = document.querySelector('body');
        (() => {
            let _body = () => {
                var d, i, dm;
                chr.cont([
                    () => {
                        module.once(Constraint.makeConstraint(modMousemove, [
                            body,
                            dm
                        ]));
                    },
                    () => {
                        outputContainer.appendChild(dm);
                    },
                    () => {
                        dm = document.createElement('div');
                    },
                    () => {
                        module.once(Constraint.makeConstraint(modEvent, [
                            codeselect,
                            'test'
                        ]));
                    },
                    () => {
                        module.once(Constraint.makeConstraint(modEvent, [
                            i,
                            'test'
                        ]));
                    },
                    () => {
                        outputContainer.appendChild(d);
                    },
                    () => {
                        d.appendChild(i);
                    },
                    () => {
                        i.type = 'number';
                    },
                    () => {
                        i.id = 'inp';
                    },
                    () => {
                        i = document.createElement('input');
                    },
                    () => {
                        d = document.createElement('div');
                    }
                ]);
            };
            chr.addConstraintListener(modInit$0, [], init => {
                let varrefs0 = [];
                if (Constraint.allAlive([init])) {
                    chr.remove(init);
                    _body();
                }
            });
        })();
    };
    let init = (chr, modname = 'Reactive', base) => {
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
        temp.stream = temp.stream || function () {
            chr.add(modname + '.stream', arguments);
        };
        temp.removeInput = temp.removeInput || function () {
            chr.add(modname + '.removeInput', arguments);
        };
        temp.input = temp.input || function () {
            chr.add(modname + '.input', arguments);
        };
        temp.handleEvent = temp.handleEvent || function () {
            chr.add(modname + '.handleEvent', arguments);
        };
        temp.event = temp.event || function () {
            chr.add(modname + '.event', arguments);
        };
        temp.once = temp.once || function () {
            chr.add(modname + '.once', arguments);
        };
        temp.mouseOutDiv = temp.mouseOutDiv || function () {
            chr.add(modname + '.mouseOutDiv', arguments);
        };
        temp.handleMouseMove = temp.handleMouseMove || function () {
            chr.add(modname + '.handleMouseMove', arguments);
        };
        temp.mousemove = temp.mousemove || function () {
            chr.add(modname + '.mousemove', arguments);
        };
        temp.init = temp.init || function () {
            chr.add(modname + '.init', arguments);
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
        reactive(chr, mod, res, base, modname);
        return base;
    };
    let Reactive = {};
    Reactive.VERSION = version;
    Reactive.init = init;
    return Reactive;
});
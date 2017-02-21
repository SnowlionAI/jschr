// This file is generated: DO NOT CHANGE!
// Changes will be overwritten...

((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.CompilerPanel = factory();
    }
})(this, () => {
    'use strict';
    let Constraint = require('/constraint.js');
    let Var = require('/var.js');
    let Index = require('/index.js');
    let Match = require('/match.js');
    let Utils = require('/utils.js');
    let version = '0.0.1';
    let compilerPanel = (chr, module, resolve, base, modname) => {
        let pointedname = modname ? modname + '.' : '';
        let modAddScript = pointedname + 'addScript';
        let modAddScript$1 = modAddScript + '/1';
        let modToDataURI = pointedname + 'toDataURI';
        let modToDataURI$3 = modToDataURI + '/3';
        let modAddStyle = pointedname + 'addStyle';
        let modAddStyle$1 = modAddStyle + '/1';
        let modSaveFile = pointedname + 'saveFile';
        let modSaveFile$2 = modSaveFile + '/2';
        let modMkLink = pointedname + 'mkLink';
        let modMkLink$3 = modMkLink + '/3';
        let modMakeElem = pointedname + 'makeElem';
        let modMakeElem$2 = modMakeElem + '/2';
        let modMakeDiv = pointedname + 'makeDiv';
        let modMakeDiv$1 = modMakeDiv + '/1';
        let modMakeSpan = pointedname + 'makeSpan';
        let modMakeSpan$1 = modMakeSpan + '/1';
        let modMakeDiv$3 = modMakeDiv + '/3';
        let modOndragover = pointedname + 'ondragover';
        let modOndragover$2 = modOndragover + '/2';
        let modOndragleave = pointedname + 'ondragleave';
        let modOndragleave$2 = modOndragleave + '/2';
        let modOndrop = pointedname + 'ondrop';
        let modOndrop$2 = modOndrop + '/2';
        let modPrev = pointedname + 'prev';
        let modPrev$2 = modPrev + '/2';
        let modPref = pointedname + 'pref';
        let modPref$3 = modPref + '/3';
        let modPrev$3 = modPrev + '/3';
        let modF = pointedname + 'f';
        let modF$1 = modF + '/1';
        let modGetFiles = pointedname + 'getFiles';
        let modGetFiles$2 = modGetFiles + '/2';
        let modPcgSave = pointedname + 'pcgSave';
        let modPcgSave$2 = modPcgSave + '/2';
        let modFileReader = pointedname + 'fileReader';
        let modFileReader$3 = modFileReader + '/3';
        let modHandleFiles = pointedname + 'handleFiles';
        let modHandleFiles$1 = modHandleFiles + '/1';
        let modInit = pointedname + 'init';
        let modInit$0 = modInit + '/0';
        let ddstyle = `
.drop {
    width: 300px;
    height: 100px;
    line-height: 100px;
    border: 5px dashed #CCC;
    
    font-family: Verdana;
    text-align: center;
}`;
        (() => {
            let _body = js => {
                var du = new Var(), script;
                chr.cont([
                    () => {
                        document.body.appendChild(script);
                    },
                    () => {
                        script.setAttribute('src', du.deref());
                    },
                    () => {
                        script = document.createElement('script');
                    },
                    () => {
                        module.toDataURI('text/javascript', js, du.deref());
                    }
                ]);
            };
            chr.addConstraintListener(modAddScript$1, [new Var()], addScript => {
                let varrefs0 = [];
                let js = addScript._$0;
                if (Constraint.allAlive([addScript])) {
                    chr.remove(addScript);
                    _body(js);
                }
            });
        })();
        (() => {
            let _body = style => {
                var du = new Var(), link;
                chr.cont([
                    () => {
                        document.body.appendChild(link);
                    },
                    () => {
                        link.setAttribute('rel', 'stylesheet');
                    },
                    () => {
                        link.setAttribute('href', du.deref());
                    },
                    () => {
                        link = document.createElement('link');
                    },
                    () => {
                        module.toDataURI('text/javascript', style, du.deref());
                    }
                ]);
            };
            chr.addConstraintListener(modAddStyle$1, [new Var()], addStyle => {
                let varrefs0 = [];
                let style = addStyle._$0;
                if (Constraint.allAlive([addStyle])) {
                    chr.remove(addStyle);
                    _body(style);
                }
            });
        })();
        (() => {
            let _body = (name, obj) => {
                var filesOut, link = new Var();
                chr.cont([
                    () => {
                        filesOut.appendChild(link.deref());
                    },
                    () => {
                        module.mkLink(name, obj, link.deref());
                    },
                    () => {
                        filesOut.style.display = 'inline';
                    },
                    () => {
                        filesOut = document.getElementById('filesOut');
                    }
                ]);
            };
            chr.addConstraintListener(modSaveFile$2, [
                new Var(),
                new Var()
            ], saveFile => {
                let varrefs0 = [];
                let name = saveFile._$0;
                let obj = saveFile._$1;
                if (Constraint.allAlive([saveFile])) {
                    chr.remove(saveFile);
                    _body(name, obj);
                }
            });
        })();
        (() => {
            let _body = (name, obj, link) => {
                var a, res = new Var();
                chr.cont([
                    () => {
                        Utils.assign(link, a);
                    },
                    () => {
                        a.style.display = 'block';
                    },
                    () => {
                        a.innerHTML = name;
                    },
                    () => {
                        a.href = res.deref();
                    },
                    () => {
                        module.toDataURI('text/javascript', obj, res.deref());
                    },
                    () => {
                        a.target = '__blank';
                    },
                    () => {
                        a.download = name;
                    },
                    () => {
                        a = document.createElement('a');
                    }
                ]);
            };
            chr.addConstraintListener(modMkLink$3, [
                new Var(),
                new Var(),
                new Var()
            ], mkLink => {
                let varrefs0 = [];
                let obj = mkLink._$1;
                let link = mkLink._$2;
                Var.wait(mkLink._$0, name => {
                    if (Constraint.allAlive([mkLink])) {
                        chr.remove(mkLink);
                        _body(name, obj, link);
                    }
                });
            });
        })();
        (() => {
            let _body = (obj, res, mime) => {
                var encoded;
                chr.cont([
                    () => {
                        Utils.assign(res, 'data:' + mime + ';base64,' + encoded);
                    },
                    () => {
                        encoded = btoa(obj);
                    }
                ]);
            };
            chr.addConstraintListener(modToDataURI$3, [
                new Var(),
                new Var(),
                new Var()
            ], toDataURI => {
                let varrefs0 = [];
                let res = toDataURI._$2;
                Var.all([
                    toDataURI._$0,
                    toDataURI._$1
                ]).waitApply((mime, obj) => {
                    if (Constraint.allAlive([toDataURI])) {
                        chr.remove(toDataURI);
                        _body(obj, res, mime);
                    }
                });
            });
        })();
        let outputContainer = document.getElementById('outputContainer');
        (() => {
            let _body = (div, elem) => {
                chr.cont(() => {
                    Utils.assign(div, document.createElement(elem));
                });
            };
            chr.addConstraintListener(modMakeElem$2, [
                new Var(),
                new Var()
            ], makeElem => {
                let varrefs0 = [];
                let div = makeElem._$1;
                Var.wait(makeElem._$0, elem => {
                    if (Constraint.allAlive([makeElem])) {
                        chr.remove(makeElem);
                        _body(div, elem);
                    }
                });
            });
        })();
        (() => {
            let _body = div => {
                chr.cont(() => {
                    module.makeElem('div', div);
                });
            };
            chr.addConstraintListener(modMakeDiv$1, [new Var()], makeDiv => {
                let varrefs0 = [];
                let div = makeDiv._$0;
                if (Constraint.allAlive([makeDiv])) {
                    chr.remove(makeDiv);
                    _body(div);
                }
            });
        })();
        (() => {
            let _body = span => {
                chr.cont(() => {
                    module.makeElem('span', span);
                });
            };
            chr.addConstraintListener(modMakeSpan$1, [new Var()], makeSpan => {
                let varrefs0 = [];
                let span = makeSpan._$0;
                if (Constraint.allAlive([makeSpan])) {
                    chr.remove(makeSpan);
                    _body(span);
                }
            });
        })();
        (() => {
            let _body = (div, id, clazz) => {
                chr.cont([
                    () => {
                        div.deref().setAttribute('class', clazz);
                    },
                    () => {
                        Var.deref(div).setAttribute('id', id);
                    },
                    () => {
                        module.makeDiv(div);
                    }
                ]);
            };
            chr.addConstraintListener(modMakeDiv$3, [
                new Var(),
                new Var(),
                new Var()
            ], makeDiv => {
                let varrefs0 = [];
                let id = makeDiv._$0;
                let clazz = makeDiv._$1;
                let div = makeDiv._$2;
                if (Constraint.allAlive([makeDiv])) {
                    chr.remove(makeDiv);
                    _body(div, id, clazz);
                }
            });
        })();
        (() => {
            let _body = (e, f) => {
                var ret = new Var();
                chr.cont(() => {
                    e.addEventListener('dragover', function (e) {
                        resolve.prev(e, f, ret.deref());
                        return ret.deref();
                    });
                });
            };
            chr.addConstraintListener(modOndragover$2, [
                new Var(),
                new Var()
            ], ondragover => {
                let varrefs0 = [];
                let e = ondragover._$0;
                let f = ondragover._$1;
                if (Constraint.allAlive([ondragover])) {
                    chr.remove(ondragover);
                    _body(e, f);
                }
            });
        })();
        (() => {
            let _body = (e, f) => {
                var ret = new Var();
                chr.cont(() => {
                    e.addEventListener('dragleave', function (e) {
                        resolve.prev(e, f, ret.deref());
                        return ret.deref();
                    });
                });
            };
            chr.addConstraintListener(modOndragleave$2, [
                new Var(),
                new Var()
            ], ondragleave => {
                let varrefs0 = [];
                let e = ondragleave._$0;
                let f = ondragleave._$1;
                if (Constraint.allAlive([ondragleave])) {
                    chr.remove(ondragleave);
                    _body(e, f);
                }
            });
        })();
        (() => {
            let _body = (e, f) => {
                var ret = new Var();
                chr.cont(() => {
                    e.addEventListener('drop', function (e) {
                        resolve.prev(e, f, ret.deref());
                        return ret.deref();
                    });
                });
            };
            chr.addConstraintListener(modOndrop$2, [
                new Var(),
                new Var()
            ], ondrop => {
                let varrefs0 = [];
                let e = ondrop._$0;
                let f = ondrop._$1;
                if (Constraint.allAlive([ondrop])) {
                    chr.remove(ondrop);
                    _body(e, f);
                }
            });
        })();
        (() => {
            let _body = (e, f) => {
                var v = new Var();
                chr.cont(() => {
                    module.pref(e, f, v.deref());
                });
            };
            chr.addConstraintListener(modPrev$2, [
                new Var(),
                new Var()
            ], prev => {
                let varrefs0 = [];
                let e = prev._$0;
                let f = prev._$1;
                if (Constraint.allAlive([prev])) {
                    chr.remove(prev);
                    _body(e, f);
                }
            });
        })();
        (() => {
            let _body = (e, f, ret) => {
                chr.cont([
                    () => {
                        Utils.assign(ret, false);
                    },
                    () => {
                        f(e);
                    },
                    () => {
                        e.preventDefault();
                    },
                    () => {
                        e.stopPropagation();
                    }
                ]);
            };
            chr.addConstraintListener(modPrev$3, [
                new Var(),
                new Var(),
                new Var()
            ], prev => {
                let varrefs0 = [];
                let e = prev._$0;
                let f = prev._$1;
                let ret = prev._$2;
                if (Constraint.allAlive([prev])) {
                    chr.remove(prev);
                    _body(e, f, ret);
                }
            });
        })();
        (() => {
            let _body = (fs, e) => {
                chr.cont(() => {
                    Utils.assign(fs, e.dataTransfer.files);
                });
            };
            chr.addConstraintListener(modGetFiles$2, [
                new Var(),
                new Var()
            ], getFiles => {
                let varrefs0 = [];
                let fs = getFiles._$1;
                Var.wait(getFiles._$0, e => {
                    if (Constraint.allAlive([getFiles])) {
                        chr.remove(getFiles);
                        _body(fs, e);
                    }
                });
            });
        })();
        (() => {
            let _body = (js, name) => {
                var jsOut;
                chr.cont([
                    () => {
                        module.saveFile(name, jsOut);
                    },
                    () => {
                        jsOut = Compiler.parseCompileGenerate(js);
                    }
                ]);
            };
            chr.addConstraintListener(modPcgSave$2, [
                new Var(),
                new Var()
            ], pcgSave => {
                let varrefs0 = [];
                let name = pcgSave._$0;
                Var.wait(pcgSave._$1, js => {
                    if (Constraint.allAlive([pcgSave])) {
                        chr.remove(pcgSave);
                        _body(js, name);
                    }
                });
            });
        })();
        let nf = function () {
            return new FileReader();
        };
        (() => {
            let _body = f => {
                var r, e = new Var();
                chr.cont([
                    () => {
                        r.readAsBinaryString(f);
                    },
                    () => {
                        r.onload = function (e) {
                            resolve.pcgSave(f.name, e.target.result);
                        };
                    },
                    () => {
                        r = nf();
                    }
                ]);
            };
            chr.addConstraintListener(modFileReader$3, [
                new Var(),
                new Var(),
                new Var()
            ], fileReader => {
                let varrefs0 = [];
                let n = fileReader._$1;
                let arr = fileReader._$2;
                Var.wait(fileReader._$0, f => {
                    if (Constraint.allAlive([fileReader])) {
                        chr.remove(fileReader);
                        _body(f);
                    }
                });
            });
        })();
        (() => {
            let _body = e => {
                var fs = new Var(), fss;
                chr.cont([
                    () => {
                        fss.forEach(resolve.fileReader.bind(undefined));
                    },
                    () => {
                        fss = Array.prototype.slice.apply(fs.deref());
                    },
                    () => {
                        module.getFiles(e, fs.deref());
                    }
                ]);
            };
            chr.addConstraintListener(modHandleFiles$1, [new Var()], handleFiles => {
                let varrefs0 = [];
                let e = handleFiles._$0;
                if (Constraint.allAlive([handleFiles])) {
                    chr.remove(handleFiles);
                    _body(e);
                }
            });
        })();
        let drop = function (e) {
            resolve.handleFiles(e);
        };
        (() => {
            let _body = () => {
                var div = new Var(), t, span = new Var();
                chr.cont([
                    () => {
                        module.ondrop(div.deref(), drop);
                    },
                    () => {
                        module.ondragleave(div.deref(), function () {
                            console.log('dragleaving...');
                        });
                    },
                    () => {
                        module.ondragover(div.deref(), function () {
                            console.log('dragover...');
                        });
                    },
                    () => {
                        module.addStyle(ddstyle);
                    },
                    () => {
                        outputContainer.appendChild(span.deref());
                    },
                    () => {
                        span.deref().style.display = 'none';
                    },
                    () => {
                        span.deref().setAttribute('id', 'filesOut');
                    },
                    () => {
                        module.makeSpan(span.deref());
                    },
                    () => {
                        outputContainer.appendChild(div.deref());
                    },
                    () => {
                        div.deref().appendChild(t);
                    },
                    () => {
                        t = document.createTextNode('drop files to compile here...');
                    },
                    () => {
                        module.makeDiv('drop', 'drop', div.deref());
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
    let init = (chr, modname = 'CompilerPanel', base) => {
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
        temp.addScript = temp.addScript || function () {
            chr.add(modname + '.addScript', arguments);
        };
        temp.toDataURI = temp.toDataURI || function () {
            chr.add(modname + '.toDataURI', arguments);
        };
        temp.addStyle = temp.addStyle || function () {
            chr.add(modname + '.addStyle', arguments);
        };
        temp.saveFile = temp.saveFile || function () {
            chr.add(modname + '.saveFile', arguments);
        };
        temp.mkLink = temp.mkLink || function () {
            chr.add(modname + '.mkLink', arguments);
        };
        temp.makeElem = temp.makeElem || function () {
            chr.add(modname + '.makeElem', arguments);
        };
        temp.makeDiv = temp.makeDiv || function () {
            chr.add(modname + '.makeDiv', arguments);
        };
        temp.makeSpan = temp.makeSpan || function () {
            chr.add(modname + '.makeSpan', arguments);
        };
        temp.ondragover = temp.ondragover || function () {
            chr.add(modname + '.ondragover', arguments);
        };
        temp.ondragleave = temp.ondragleave || function () {
            chr.add(modname + '.ondragleave', arguments);
        };
        temp.ondrop = temp.ondrop || function () {
            chr.add(modname + '.ondrop', arguments);
        };
        temp.prev = temp.prev || function () {
            chr.add(modname + '.prev', arguments);
        };
        temp.pref = temp.pref || function () {
            chr.add(modname + '.pref', arguments);
        };
        temp.f = temp.f || function () {
            chr.add(modname + '.f', arguments);
        };
        temp.getFiles = temp.getFiles || function () {
            chr.add(modname + '.getFiles', arguments);
        };
        temp.pcgSave = temp.pcgSave || function () {
            chr.add(modname + '.pcgSave', arguments);
        };
        temp.fileReader = temp.fileReader || function () {
            chr.add(modname + '.fileReader', arguments);
        };
        temp.handleFiles = temp.handleFiles || function () {
            chr.add(modname + '.handleFiles', arguments);
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
        compilerPanel(chr, mod, res, base, modname);
        return base;
    };
    let CompilerPanel = {};
    CompilerPanel.VERSION = version;
    CompilerPanel.init = init;
    return CompilerPanel;
});
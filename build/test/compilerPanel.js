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
    let version = '0.0.1';
    let compilerPanel = (chr, module, resolve, modbase, modname) => {
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
            let body = js => {
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
                        chr.add(modToDataURI, [
                            'text/javascript',
                            js,
                            du.deref()
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modAddScript$1, [new Var()], addScript => {
                let varrefs0 = [];
                let js = addScript.args[0];
                if (Constraint.allAlive([addScript])) {
                    chr.remove(addScript);
                    body(js);
                }
            });
        })();
        (() => {
            let body = style => {
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
                        chr.add(modToDataURI, [
                            'text/javascript',
                            style,
                            du.deref()
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modAddStyle$1, [new Var()], addStyle => {
                let varrefs0 = [];
                let style = addStyle.args[0];
                if (Constraint.allAlive([addStyle])) {
                    chr.remove(addStyle);
                    body(style);
                }
            });
        })();
        (() => {
            let body = (name, obj) => {
                var filesOut, link = new Var();
                chr.cont([
                    () => {
                        filesOut.appendChild(link.deref());
                    },
                    () => {
                        chr.add(modMkLink, [
                            name,
                            obj,
                            link.deref()
                        ]);
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
                let name = saveFile.args[0];
                let obj = saveFile.args[1];
                if (Constraint.allAlive([saveFile])) {
                    chr.remove(saveFile);
                    body(name, obj);
                }
            });
        })();
        (() => {
            let body = (name, obj, link) => {
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
                        chr.add(modToDataURI, [
                            'text/javascript',
                            obj,
                            res.deref()
                        ]);
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
                let obj = mkLink.args[1];
                let link = mkLink.args[2];
                Var.wait(mkLink.args[0], name => {
                    if (Constraint.allAlive([mkLink])) {
                        chr.remove(mkLink);
                        body(name, obj, link);
                    }
                });
            });
        })();
        (() => {
            let body = (obj, res, mime) => {
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
                let res = toDataURI.args[2];
                Var.all([
                    toDataURI.args[0],
                    toDataURI.args[1]
                ]).waitApply((mime, obj) => {
                    if (Constraint.allAlive([toDataURI])) {
                        chr.remove(toDataURI);
                        body(obj, res, mime);
                    }
                });
            });
        })();
        let outputContainer = document.getElementById('outputContainer');
        (() => {
            let body = (div, elem) => {
                chr.cont(() => {
                    Utils.assign(div, document.createElement(elem));
                });
            };
            chr.addConstraintListener(modMakeElem$2, [
                new Var(),
                new Var()
            ], makeElem => {
                let varrefs0 = [];
                let div = makeElem.args[1];
                Var.wait(makeElem.args[0], elem => {
                    if (Constraint.allAlive([makeElem])) {
                        chr.remove(makeElem);
                        body(div, elem);
                    }
                });
            });
        })();
        (() => {
            let body = div => {
                chr.cont(() => {
                    chr.add(modMakeElem, [
                        'div',
                        div
                    ]);
                });
            };
            chr.addConstraintListener(modMakeDiv$1, [new Var()], makeDiv => {
                let varrefs0 = [];
                let div = makeDiv.args[0];
                if (Constraint.allAlive([makeDiv])) {
                    chr.remove(makeDiv);
                    body(div);
                }
            });
        })();
        (() => {
            let body = span => {
                chr.cont(() => {
                    chr.add(modMakeElem, [
                        'span',
                        span
                    ]);
                });
            };
            chr.addConstraintListener(modMakeSpan$1, [new Var()], makeSpan => {
                let varrefs0 = [];
                let span = makeSpan.args[0];
                if (Constraint.allAlive([makeSpan])) {
                    chr.remove(makeSpan);
                    body(span);
                }
            });
        })();
        (() => {
            let body = (div, id, clazz) => {
                chr.cont([
                    () => {
                        div.deref().setAttribute('class', clazz);
                    },
                    () => {
                        Var.deref(div).setAttribute('id', id);
                    },
                    () => {
                        chr.add(modMakeDiv, [div]);
                    }
                ]);
            };
            chr.addConstraintListener(modMakeDiv$3, [
                new Var(),
                new Var(),
                new Var()
            ], makeDiv => {
                let varrefs0 = [];
                let id = makeDiv.args[0];
                let clazz = makeDiv.args[1];
                let div = makeDiv.args[2];
                if (Constraint.allAlive([makeDiv])) {
                    chr.remove(makeDiv);
                    body(div, id, clazz);
                }
            });
        })();
        (() => {
            let body = (e, f) => {
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
                let e = ondragover.args[0];
                let f = ondragover.args[1];
                if (Constraint.allAlive([ondragover])) {
                    chr.remove(ondragover);
                    body(e, f);
                }
            });
        })();
        (() => {
            let body = (e, f) => {
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
                let e = ondragleave.args[0];
                let f = ondragleave.args[1];
                if (Constraint.allAlive([ondragleave])) {
                    chr.remove(ondragleave);
                    body(e, f);
                }
            });
        })();
        (() => {
            let body = (e, f) => {
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
                let e = ondrop.args[0];
                let f = ondrop.args[1];
                if (Constraint.allAlive([ondrop])) {
                    chr.remove(ondrop);
                    body(e, f);
                }
            });
        })();
        (() => {
            let body = (e, f) => {
                var v = new Var();
                chr.cont(() => {
                    chr.add(modPref, [
                        e,
                        f,
                        v.deref()
                    ]);
                });
            };
            chr.addConstraintListener(modPrev$2, [
                new Var(),
                new Var()
            ], prev => {
                let varrefs0 = [];
                let e = prev.args[0];
                let f = prev.args[1];
                if (Constraint.allAlive([prev])) {
                    chr.remove(prev);
                    body(e, f);
                }
            });
        })();
        (() => {
            let body = (e, f, ret) => {
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
                let e = prev.args[0];
                let f = prev.args[1];
                let ret = prev.args[2];
                if (Constraint.allAlive([prev])) {
                    chr.remove(prev);
                    body(e, f, ret);
                }
            });
        })();
        (() => {
            let body = (fs, e) => {
                chr.cont(() => {
                    Utils.assign(fs, e.dataTransfer.files);
                });
            };
            chr.addConstraintListener(modGetFiles$2, [
                new Var(),
                new Var()
            ], getFiles => {
                let varrefs0 = [];
                let fs = getFiles.args[1];
                Var.wait(getFiles.args[0], e => {
                    if (Constraint.allAlive([getFiles])) {
                        chr.remove(getFiles);
                        body(fs, e);
                    }
                });
            });
        })();
        (() => {
            let body = (js, name) => {
                var jsOut;
                chr.cont([
                    () => {
                        chr.add(modSaveFile, [
                            name,
                            jsOut
                        ]);
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
                let name = pcgSave.args[0];
                Var.wait(pcgSave.args[1], js => {
                    if (Constraint.allAlive([pcgSave])) {
                        chr.remove(pcgSave);
                        body(js, name);
                    }
                });
            });
        })();
        let nf = function () {
            return new FileReader();
        };
        (() => {
            let body = f => {
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
                let n = fileReader.args[1];
                let arr = fileReader.args[2];
                Var.wait(fileReader.args[0], f => {
                    if (Constraint.allAlive([fileReader])) {
                        chr.remove(fileReader);
                        body(f);
                    }
                });
            });
        })();
        (() => {
            let body = e => {
                var fs = new Var(), fss;
                chr.cont([
                    () => {
                        fss.forEach(resolve.fileReader.bind(undefined));
                    },
                    () => {
                        fss = Array.prototype.slice.apply(fs.deref());
                    },
                    () => {
                        chr.add(modGetFiles, [
                            e,
                            fs.deref()
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modHandleFiles$1, [new Var()], handleFiles => {
                let varrefs0 = [];
                let e = handleFiles.args[0];
                if (Constraint.allAlive([handleFiles])) {
                    chr.remove(handleFiles);
                    body(e);
                }
            });
        })();
        let drop = function (e) {
            resolve.handleFiles(e);
        };
        (() => {
            let body = () => {
                var div = new Var(), t, span = new Var();
                chr.cont([
                    () => {
                        chr.add(modOndrop, [
                            div.deref(),
                            drop
                        ]);
                    },
                    () => {
                        chr.add(modOndragleave, [
                            div.deref(),
                            function () {
                                console.log('dragleaving...');
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOndragover, [
                            div.deref(),
                            function () {
                                console.log('dragover...');
                            }
                        ]);
                    },
                    () => {
                        chr.add(modAddStyle, [ddstyle]);
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
                        chr.add(modMakeSpan, [span.deref()]);
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
                        chr.add(modMakeDiv, [
                            'drop',
                            'drop',
                            div.deref()
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modInit$0, [], init => {
                let varrefs0 = [];
                if (Constraint.allAlive([init])) {
                    chr.remove(init);
                    body();
                }
            });
        })();
    };
    let init = (chr, modbase, modname = 'CompilerPanel') => {
        let mod;
        if (modbase === undefined) {
            chr.Modules = chr.Modules || {};
            modbase = chr.Modules;
        }
        modbase[modname] = modbase[modname] || {};
        mod = modbase[modname];
        let temp = {};
        temp.addScript = temp.addScript || function () {
            chr.addConstraint(modname + '.addScript', arguments);
        };
        temp.toDataURI = temp.toDataURI || function () {
            chr.addConstraint(modname + '.toDataURI', arguments);
        };
        temp.addStyle = temp.addStyle || function () {
            chr.addConstraint(modname + '.addStyle', arguments);
        };
        temp.saveFile = temp.saveFile || function () {
            chr.addConstraint(modname + '.saveFile', arguments);
        };
        temp.mkLink = temp.mkLink || function () {
            chr.addConstraint(modname + '.mkLink', arguments);
        };
        temp.makeElem = temp.makeElem || function () {
            chr.addConstraint(modname + '.makeElem', arguments);
        };
        temp.makeDiv = temp.makeDiv || function () {
            chr.addConstraint(modname + '.makeDiv', arguments);
        };
        temp.makeSpan = temp.makeSpan || function () {
            chr.addConstraint(modname + '.makeSpan', arguments);
        };
        temp.ondragover = temp.ondragover || function () {
            chr.addConstraint(modname + '.ondragover', arguments);
        };
        temp.ondragleave = temp.ondragleave || function () {
            chr.addConstraint(modname + '.ondragleave', arguments);
        };
        temp.ondrop = temp.ondrop || function () {
            chr.addConstraint(modname + '.ondrop', arguments);
        };
        temp.prev = temp.prev || function () {
            chr.addConstraint(modname + '.prev', arguments);
        };
        temp.pref = temp.pref || function () {
            chr.addConstraint(modname + '.pref', arguments);
        };
        temp.f = temp.f || function () {
            chr.addConstraint(modname + '.f', arguments);
        };
        temp.getFiles = temp.getFiles || function () {
            chr.addConstraint(modname + '.getFiles', arguments);
        };
        temp.pcgSave = temp.pcgSave || function () {
            chr.addConstraint(modname + '.pcgSave', arguments);
        };
        temp.fileReader = temp.fileReader || function () {
            chr.addConstraint(modname + '.fileReader', arguments);
        };
        temp.handleFiles = temp.handleFiles || function () {
            chr.addConstraint(modname + '.handleFiles', arguments);
        };
        temp.init = temp.init || function () {
            chr.addConstraint(modname + '.init', arguments);
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
        compilerPanel(chr, mod, res, modbase, modname);
        return {
            base: modbase,
            module: mod,
            resolve: res,
            modname: modname
        };
    };
    let CompilerPanel = {};
    CompilerPanel.VERSION = version;
    CompilerPanel.init = init;
    return CompilerPanel;
});
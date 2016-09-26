((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Playground = factory();
    }
})(this, () => {
    'use strict';
    let version = '0.0.1';
    let playground = (chr, module, resolve, modbase, modname) => {
        let pointedname = modname ? modname + '.' : '';
        let modAddScript = pointedname + 'addScript';
        let modAddScript$1 = modAddScript + '/1';
        let modToDataURI = pointedname + 'toDataURI';
        let modToDataURI$3 = modToDataURI + '/3';
        let modOnhoverText = pointedname + 'onhoverText';
        let modOnhoverText$2 = modOnhoverText + '/2';
        let modRemoveChildren = pointedname + 'removeChildren';
        let modRemoveChildren$1 = modRemoveChildren + '/1';
        let modRemoveOptions = pointedname + 'removeOptions';
        let modRemoveOptions$1 = modRemoveOptions + '/1';
        let modGetText = pointedname + 'getText';
        let modGetText$2 = modGetText + '/2';
        let modSetText = pointedname + 'setText';
        let modSetText$2 = modSetText + '/2';
        let modCompile = pointedname + 'compile';
        let modCompile$0 = modCompile + '/0';
        let modCompiled = pointedname + 'compiled';
        let modCompiled$1 = modCompiled + '/1';
        let modEditor = pointedname + 'editor';
        let modEditor$2 = modEditor + '/2';
        let modSetDisabled = pointedname + 'setDisabled';
        let modSetDisabled$2 = modSetDisabled + '/2';
        let modSetEditorValue = pointedname + 'setEditorValue';
        let modSetEditorValue$2 = modSetEditorValue + '/2';
        let modClearSelection = pointedname + 'clearSelection';
        let modClearSelection$1 = modClearSelection + '/1';
        let modInject = pointedname + 'inject';
        let modInject$0 = modInject + '/0';
        let modExec = pointedname + 'exec';
        let modExec$0 = modExec + '/0';
        let modSetDisplay = pointedname + 'setDisplay';
        let modSetDisplay$1 = modSetDisplay + '/1';
        let modClear = pointedname + 'clear';
        let modClear$0 = modClear + '/0';
        let modSetDisabled$1 = modSetDisabled + '/1';
        let modOnclick = pointedname + 'onclick';
        let modOnclick$2 = modOnclick + '/2';
        let modPlayground = pointedname + 'playground';
        let modPlayground$3 = modPlayground + '/3';
        let modSetDisplay$2 = modSetDisplay + '/2';
        let modSelect = pointedname + 'select';
        let modSelect$1 = modSelect + '/1';
        let modTimestamp = pointedname + 'timestamp';
        let modTimestamp$1 = modTimestamp + '/1';
        let modTime = pointedname + 'time';
        let modTime$0 = modTime + '/0';
        let modInitEditor = pointedname + 'initEditor';
        let modInitEditor$1 = modInitEditor + '/1';
        let modOnEditorChange = pointedname + 'onEditorChange';
        let modOnEditorChange$2 = modOnEditorChange + '/2';
        let modEditorEnlarge = pointedname + 'editorEnlarge';
        let modEditorEnlarge$0 = modEditorEnlarge + '/0';
        let modInit = pointedname + 'init';
        let modInit$1 = modInit + '/1';
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
        (() => {
            let guard = n => {
                return n.constructor === String;
            };
            let body = (n, ht) => {
                var e;
                chr.cont([
                    () => {
                        chr.add(modOnhoverText, [
                            e,
                            ht
                        ]);
                    },
                    () => {
                        e = document.getElementById(n);
                    }
                ]);
            };
            chr.addConstraintListener(modOnhoverText$2, [
                new Var(),
                new Var()
            ], onhoverText => {
                let varrefs0 = [];
                let ht = onhoverText.args[1];
                Var.wait(onhoverText.args[0], n => {
                    if (Constraint.allAlive([onhoverText])) {
                        if (guard(n)) {
                            chr.remove(onhoverText);
                            body(n, ht);
                        }
                    }
                });
            });
        })();
        (() => {
            let body = (e, ht) => {
                var prev;
                chr.cont([
                    () => {
                        e.onmouseleave = () => {
                            e.innerText == ht && (e.innerText = prev);
                        };
                    },
                    () => {
                        e.onmouseenter = () => {
                            prev = e.innerText;
                            e.innerText = ht;
                        };
                    },
                    () => {
                        prev = undefined;
                    }
                ]);
            };
            chr.addConstraintListener(modOnhoverText$2, [
                new Var(),
                new Var()
            ], onhoverText => {
                let varrefs0 = [];
                Var.all([
                    onhoverText.args[0],
                    onhoverText.args[1]
                ]).waitApply((e, ht) => {
                    if (Constraint.allAlive([onhoverText])) {
                        chr.remove(onhoverText);
                        body(e, ht);
                    }
                });
            });
        })();
        (() => {
            let guard = p => {
                return p.constructor === String;
            };
            let body = p => {
                var o;
                chr.cont([
                    () => {
                        chr.add(modRemoveChildren, [o]);
                    },
                    () => {
                        o = document.getElementById(p);
                    }
                ]);
            };
            chr.addConstraintListener(modRemoveChildren$1, [new Var()], removeChildren => {
                let varrefs0 = [];
                Var.wait(removeChildren.args[0], p => {
                    if (Constraint.allAlive([removeChildren])) {
                        if (guard(p)) {
                            chr.remove(removeChildren);
                            body(p);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = p => {
                return p.hasChildNodes();
            };
            let body = p => {
                chr.cont([
                    () => {
                        chr.add(modRemoveChildren, [p]);
                    },
                    () => {
                        p.removeChild(p.lastChild);
                    }
                ]);
            };
            chr.addConstraintListener(modRemoveChildren$1, [new Var()], removeChildren => {
                let varrefs0 = [];
                Var.wait(removeChildren.args[0], p => {
                    if (Constraint.allAlive([removeChildren])) {
                        if (guard(p)) {
                            chr.remove(removeChildren);
                            body(p);
                        }
                    }
                });
            });
        })();
        (() => {
            chr.addConstraintListener(modRemoveChildren$1, [new Var()], removeChildren => {
                let varrefs0 = [];
                let _ = removeChildren.args[0];
                if (Constraint.allAlive([removeChildren])) {
                    chr.remove(removeChildren);
                }
            });
        })();
        (() => {
            let guard = p => {
                return p.constructor === String;
            };
            let body = p => {
                var o;
                chr.cont([
                    () => {
                        chr.add(modRemoveOptions, [o]);
                    },
                    () => {
                        o = document.getElementById(p);
                    }
                ]);
            };
            chr.addConstraintListener(modRemoveOptions$1, [new Var()], removeOptions => {
                let varrefs0 = [];
                Var.wait(removeOptions.args[0], p => {
                    if (Constraint.allAlive([removeOptions])) {
                        if (guard(p)) {
                            chr.remove(removeOptions);
                            body(p);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = p => {
                return p.length > 0;
            };
            let body = p => {
                chr.cont([
                    () => {
                        chr.add(modRemoveOptions, [p]);
                    },
                    () => {
                        p[0].remove();
                    }
                ]);
            };
            chr.addConstraintListener(modRemoveOptions$1, [new Var()], removeOptions => {
                let varrefs0 = [];
                Var.wait(removeOptions.args[0], p => {
                    if (Constraint.allAlive([removeOptions])) {
                        if (guard(p)) {
                            chr.remove(removeOptions);
                            body(p);
                        }
                    }
                });
            });
        })();
        (() => {
            chr.addConstraintListener(modRemoveOptions$1, [new Var()], removeOptions => {
                let varrefs0 = [];
                let _ = removeOptions.args[0];
                if (Constraint.allAlive([removeOptions])) {
                    chr.remove(removeOptions);
                }
            });
        })();
        (() => {
            let guard = n => {
                return n.constructor === String;
            };
            let body = (n, t) => {
                var r;
                chr.cont([
                    () => {
                        chr.add(modGetText, [
                            r,
                            t
                        ]);
                    },
                    () => {
                        r = document.getElementById(n);
                    }
                ]);
            };
            chr.addConstraintListener(modGetText$2, [
                new Var(),
                new Var()
            ], getText => {
                let varrefs0 = [];
                let t = getText.args[1];
                Var.wait(getText.args[0], n => {
                    if (Constraint.allAlive([getText])) {
                        if (guard(n)) {
                            chr.remove(getText);
                            body(n, t);
                        }
                    }
                });
            });
        })();
        (() => {
            let body = (t, e) => {
                chr.cont(() => {
                    Utils.assign(t, e.innerText);
                });
            };
            chr.addConstraintListener(modGetText$2, [
                new Var(),
                new Var()
            ], getText => {
                let varrefs0 = [];
                let t = getText.args[1];
                Var.wait(getText.args[0], e => {
                    if (Constraint.allAlive([getText])) {
                        chr.remove(getText);
                        body(t, e);
                    }
                });
            });
        })();
        (() => {
            let guard = n => {
                return n.constructor === String;
            };
            let body = (n, t) => {
                var r;
                chr.cont([
                    () => {
                        chr.add(modSetText, [
                            r,
                            t
                        ]);
                    },
                    () => {
                        r = document.getElementById(n);
                    }
                ]);
            };
            chr.addConstraintListener(modSetText$2, [
                new Var(),
                new Var()
            ], setText => {
                let varrefs0 = [];
                let t = setText.args[1];
                Var.wait(setText.args[0], n => {
                    if (Constraint.allAlive([setText])) {
                        if (guard(n)) {
                            chr.remove(setText);
                            body(n, t);
                        }
                    }
                });
            });
        })();
        (() => {
            let body = (e, t) => {
                chr.cont(() => {
                    e.innerText = t;
                });
            };
            chr.addConstraintListener(modSetText$2, [
                new Var(),
                new Var()
            ], setText => {
                let varrefs0 = [];
                let e = setText.args[0];
                Var.wait(setText.args[1], t => {
                    if (Constraint.allAlive([setText])) {
                        chr.remove(setText);
                        body(e, t);
                    }
                });
            });
        })();
        (() => {
            chr.addConstraintListener(modCompiled$1, [new Var()], compiled => {
                if (chr.has(modCompile$0, 1)) {
                    let varrefs0 = [];
                    let _ = compiled.args[0];
                    chr.select(modCompile$0, { 'check': Constraint.alive }, compile => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        if (Constraint.allAlive([
                                compile,
                                compiled
                            ])) {
                            chr.remove(compiled);
                            $cont = false;
                        }
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modCompile$0, [], compile => {
                if (chr.has(modCompiled$1, 1)) {
                    let varrefs0 = [];
                    chr.select(modCompiled$1, { 'check': Constraint.alive }, compiled => {
                        let varrefs1 = varrefs0.slice();
                        let _ = compiled.args[0];
                        if (Constraint.allAlive([
                                compile,
                                compiled
                            ])) {
                            chr.remove(compiled);
                        }
                        return true;
                    });
                }
            });
        })();
        (() => {
            let body = e => {
                var js, jsOut;
                chr.cont([
                    () => {
                        chr.add(modCompiled, [jsOut]);
                    },
                    () => {
                        jsOut = Compiler.parseCompileGenerate(js);
                    },
                    () => {
                        js = e.getValue();
                    }
                ]);
            };
            chr.addConstraintListener(modCompile$0, [], compile => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq('editor')
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        Match.match(editor.args[0], 'editor', varrefs1).wait(_ => {
                            Var.wait(editor.args[1], e => {
                                if (Constraint.allAlive([
                                        editor,
                                        compile
                                    ])) {
                                    chr.remove(compile);
                                    $cont = false;
                                    body(e);
                                }
                            });
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                'editor',
                new Var()
            ], editor => {
                if (chr.has(modCompile$0, 1)) {
                    let varrefs0 = [];
                    Var.wait(editor.args[1], e => {
                        Match.match(editor.args[0], 'editor', varrefs0).wait(_ => {
                            chr.select(modCompile$0, { 'check': Constraint.alive }, compile => {
                                let varrefs1 = varrefs0.slice();
                                if (Constraint.allAlive([
                                        editor,
                                        compile
                                    ])) {
                                    chr.remove(compile);
                                    body(e);
                                }
                                return true;
                            });
                        });
                    });
                }
            });
        })();
        (() => {
            let body = jsOut => {
                chr.cont([
                    () => {
                        chr.add(modClearSelection, ['editorOut']);
                    },
                    () => {
                        chr.add(modSetEditorValue, [
                            'editorOut',
                            jsOut
                        ]);
                    },
                    () => {
                        chr.add(modSetDisabled, [
                            'inject',
                            false
                        ]);
                    },
                    () => {
                        chr.add(modSetText, [
                            'compile',
                            'Compiled'
                        ]);
                    }
                ]);
            };
            chr.addConstraintListener(modCompiled$1, [new Var()], compiled => {
                let varrefs0 = [];
                let jsOut = compiled.args[0];
                if (Constraint.allAlive([compiled])) {
                    body(jsOut);
                }
            });
        })();
        (() => {
            let body = e => {
                var js;
                chr.cont([
                    () => {
                        chr.add(modSetDisabled, [
                            'exec',
                            false
                        ]);
                    },
                    () => {
                        chr.add(modSetText, [
                            'inject',
                            'Injected'
                        ]);
                    },
                    () => {
                        chr.add(modAddScript, [js]);
                    },
                    () => {
                        js = e.getValue();
                    }
                ]);
            };
            chr.addConstraintListener(modInject$0, [], inject => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq('editorOut')
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        Match.match(editor.args[0], 'editorOut', varrefs1).wait(_ => {
                            Var.wait(editor.args[1], e => {
                                if (Constraint.allAlive([
                                        editor,
                                        inject
                                    ])) {
                                    chr.remove(inject);
                                    $cont = false;
                                    body(e);
                                }
                            });
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                'editorOut',
                new Var()
            ], editor => {
                if (chr.has(modInject$0, 1)) {
                    let varrefs0 = [];
                    Var.wait(editor.args[1], e => {
                        Match.match(editor.args[0], 'editorOut', varrefs0).wait(_ => {
                            chr.select(modInject$0, { 'check': Constraint.alive }, inject => {
                                let varrefs1 = varrefs0.slice();
                                if (Constraint.allAlive([
                                        editor,
                                        inject
                                    ])) {
                                    chr.remove(inject);
                                    body(e);
                                }
                                return true;
                            });
                        });
                    });
                }
            });
        })();
        (() => {
            let body = e => {
                var js;
                chr.cont([
                    () => {
                        chr.add(modSetDisabled, [
                            'clearOutput',
                            false
                        ]);
                    },
                    () => {
                        chr.add(modSetDisplay, ['outputblock']);
                    },
                    () => {
                        chr.add(modSetText, [
                            'exec',
                            'Executed'
                        ]);
                    },
                    () => {
                        chr.add(modAddScript, [js]);
                    },
                    () => {
                        js = e.getValue();
                    }
                ]);
            };
            chr.addConstraintListener(modExec$0, [], exec => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq('editorExec')
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        Match.match(editor.args[0], 'editorExec', varrefs1).wait(_ => {
                            Var.wait(editor.args[1], e => {
                                if (Constraint.allAlive([
                                        editor,
                                        exec
                                    ])) {
                                    chr.remove(exec);
                                    $cont = false;
                                    body(e);
                                }
                            });
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                'editorExec',
                new Var()
            ], editor => {
                if (chr.has(modExec$0, 1)) {
                    let varrefs0 = [];
                    Var.wait(editor.args[1], e => {
                        Match.match(editor.args[0], 'editorExec', varrefs0).wait(_ => {
                            chr.select(modExec$0, { 'check': Constraint.alive }, exec => {
                                let varrefs1 = varrefs0.slice();
                                if (Constraint.allAlive([
                                        editor,
                                        exec
                                    ])) {
                                    chr.remove(exec);
                                    body(e);
                                }
                                return true;
                            });
                        });
                    });
                }
            });
        })();
        (() => {
            let body = () => {
                chr.cont([
                    () => {
                        chr.add(modSetText, [
                            'exec',
                            'Execute'
                        ]);
                    },
                    () => {
                        chr.add(modSetText, [
                            'outputContainer',
                            ''
                        ]);
                    },
                    () => {
                        chr.add(modSetDisabled, ['clearOutput']);
                    },
                    () => {
                        chr.add(modRemoveChildren, ['outputContainer']);
                    }
                ]);
            };
            chr.addConstraintListener(modClear$0, [], clear => {
                let varrefs0 = [];
                if (Constraint.allAlive([clear])) {
                    chr.remove(clear);
                    body();
                }
            });
        })();
        (() => {
            let guard = n => {
                return n.constructor === String;
            };
            let body = (n, f) => {
                var e;
                chr.cont([
                    () => {
                        chr.add(modOnclick, [
                            e,
                            f
                        ]);
                    },
                    () => {
                        e = document.getElementById(n);
                    }
                ]);
            };
            chr.addConstraintListener(modOnclick$2, [
                new Var(),
                new Var()
            ], onclick => {
                let varrefs0 = [];
                let f = onclick.args[1];
                Var.wait(onclick.args[0], n => {
                    if (Constraint.allAlive([onclick])) {
                        if (guard(n)) {
                            chr.remove(onclick);
                            body(n, f);
                        }
                    }
                });
            });
        })();
        (() => {
            let body = (e, f) => {
                chr.cont(() => {
                    e.onclick = f;
                });
            };
            chr.addConstraintListener(modOnclick$2, [
                new Var(),
                new Var()
            ], onclick => {
                let varrefs0 = [];
                let e = onclick.args[0];
                Var.wait(onclick.args[1], f => {
                    if (Constraint.allAlive([onclick])) {
                        chr.remove(onclick);
                        body(e, f);
                    }
                });
            });
        })();
        let sel = document.getElementById('codeselect');
        (() => {
            chr.addConstraintListener(modPlayground$3, [
                new Var(),
                new Var(),
                new Var()
            ], playground2 => {
                if (chr.has(modPlayground$3, 2)) {
                    let varrefs0 = [];
                    let name = playground2.args[0];
                    let code2 = playground2.args[1];
                    let testcode2 = playground2.args[2];
                    let excl = {};
                    excl[playground2.id] = true;
                    chr.select(modPlayground$3, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(name)
                            }]
                    }, excl, playground1 => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let code1 = playground1.args[1];
                        let testcode1 = playground1.args[2];
                        Match.match(name, playground1.args[0], varrefs1).wait(name => {
                            if (Constraint.allAlive([
                                    playground1,
                                    playground2
                                ])) {
                                chr.remove(playground2);
                                $cont = false;
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modPlayground$3, [
                new Var(),
                new Var(),
                new Var()
            ], playground1 => {
                if (chr.has(modPlayground$3, 2)) {
                    let varrefs0 = [];
                    let name = playground1.args[0];
                    let code1 = playground1.args[1];
                    let testcode1 = playground1.args[2];
                    let excl = {};
                    excl[playground1.id] = true;
                    chr.select(modPlayground$3, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(name)
                            }]
                    }, excl, playground2 => {
                        let varrefs1 = varrefs0.slice();
                        let code2 = playground2.args[1];
                        let testcode2 = playground2.args[2];
                        Match.match(name, playground2.args[0], varrefs1).wait(name => {
                            if (Constraint.allAlive([
                                    playground1,
                                    playground2
                                ])) {
                                chr.remove(playground2);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        (() => {
            let body = name => {
                var opt;
                chr.cont([
                    () => {
                        sel.add(opt);
                    },
                    () => {
                        opt.value = name;
                    },
                    () => {
                        opt.text = name;
                    },
                    () => {
                        opt.selected = false;
                    },
                    () => {
                        opt = document.createElement('option');
                    },
                    () => {
                        console.log(name);
                    }
                ]);
            };
            chr.addConstraintListener(modPlayground$3, [
                new Var(),
                new Var(),
                new Var()
            ], playground => {
                let varrefs0 = [];
                let code = playground.args[1];
                let testcode = playground.args[2];
                Var.wait(playground.args[0], name => {
                    if (Constraint.allAlive([playground])) {
                        body(name);
                    }
                });
            });
        })();
        (() => {
            let body = id => {
                chr.cont(() => {
                    chr.add(modSetDisabled, [
                        id,
                        true
                    ]);
                });
            };
            chr.addConstraintListener(modSetDisabled$1, [new Var()], setDisabled => {
                let varrefs0 = [];
                let id = setDisabled.args[0];
                if (Constraint.allAlive([setDisabled])) {
                    chr.remove(setDisabled);
                    body(id);
                }
            });
        })();
        (() => {
            let body = (id, state) => {
                var e;
                chr.cont([
                    () => {
                        e.disabled = state;
                    },
                    () => {
                        e = document.getElementById(id);
                    }
                ]);
            };
            chr.addConstraintListener(modSetDisabled$2, [
                new Var(),
                new Var()
            ], setDisabled => {
                let varrefs0 = [];
                Var.all([
                    setDisabled.args[0],
                    setDisabled.args[1]
                ]).waitApply((id, state) => {
                    if (Constraint.allAlive([setDisabled])) {
                        chr.remove(setDisabled);
                        body(id, state);
                    }
                });
            });
        })();
        (() => {
            let body = id => {
                chr.cont(() => {
                    chr.add(modSetDisplay, [
                        id,
                        true
                    ]);
                });
            };
            chr.addConstraintListener(modSetDisplay$1, [new Var()], setDisplay => {
                let varrefs0 = [];
                let id = setDisplay.args[0];
                if (Constraint.allAlive([setDisplay])) {
                    chr.remove(setDisplay);
                    body(id);
                }
            });
        })();
        (() => {
            let body = (id, state) => {
                var e;
                chr.cont([
                    () => {
                        e.style.display = state ? 'block' : 'none';
                    },
                    () => {
                        e = document.getElementById(id);
                    }
                ]);
            };
            chr.addConstraintListener(modSetDisplay$2, [
                new Var(),
                new Var()
            ], setDisplay => {
                let varrefs0 = [];
                Var.all([
                    setDisplay.args[0],
                    setDisplay.args[1]
                ]).waitApply((id, state) => {
                    if (Constraint.allAlive([setDisplay])) {
                        chr.remove(setDisplay);
                        body(id, state);
                    }
                });
            });
        })();
        (() => {
            let guard = i => {
                return i.constructor === Number && i < 0;
            };
            let body = i => {
                chr.cont(() => {
                    chr.add(modSelect, [sel.length + i]);
                });
            };
            chr.addConstraintListener(modSelect$1, [new Var()], select => {
                let varrefs0 = [];
                Var.wait(select.args[0], i => {
                    if (Constraint.allAlive([select])) {
                        if (guard(i)) {
                            chr.remove(select);
                            body(i);
                        }
                    }
                });
            });
        })();
        (() => {
            let guard = i => {
                return i.constructor === Number && i >= 0 && i < sel.length;
            };
            let body = i => {
                chr.cont(() => {
                    chr.add(modSelect, [sel[i].value]);
                });
            };
            chr.addConstraintListener(modSelect$1, [new Var()], select => {
                let varrefs0 = [];
                Var.wait(select.args[0], i => {
                    if (Constraint.allAlive([select])) {
                        if (guard(i)) {
                            chr.remove(select);
                            body(i);
                        }
                    }
                });
            });
        })();
        (() => {
            let body = (name, code, testcode) => {
                chr.cont([
                    () => {
                        chr.add(modSetDisabled, ['clearOutput']);
                    },
                    () => {
                        chr.add(modSetDisabled, ['exec']);
                    },
                    () => {
                        chr.add(modSetDisabled, [
                            'inject',
                            true
                        ]);
                    },
                    () => {
                        chr.add(modClearSelection, ['editorExec']);
                    },
                    () => {
                        chr.add(modSetEditorValue, [
                            'editorExec',
                            testcode
                        ]);
                    },
                    () => {
                        chr.add(modClearSelection, ['editorOut']);
                    },
                    () => {
                        chr.add(modSetEditorValue, [
                            'editorOut',
                            ''
                        ]);
                    },
                    () => {
                        chr.add(modClearSelection, ['editor']);
                    },
                    () => {
                        chr.add(modSetEditorValue, [
                            'editor',
                            code
                        ]);
                    },
                    () => {
                        console.log(name);
                    }
                ]);
            };
            chr.addConstraintListener(modSelect$1, [new Var()], select => {
                if (chr.has(modPlayground$3, 1)) {
                    let varrefs0 = [];
                    let name = select.args[0];
                    chr.select(modPlayground$3, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(name)
                            }]
                    }, playground => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let code = playground.args[1];
                        let testcode = playground.args[2];
                        Match.match(name, playground.args[0], varrefs1).wait(name => {
                            if (Constraint.allAlive([
                                    playground,
                                    select
                                ])) {
                                chr.remove(select);
                                $cont = false;
                                body(name, code, testcode);
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modPlayground$3, [
                new Var(),
                new Var(),
                new Var()
            ], playground => {
                if (chr.has(modSelect$1, 1)) {
                    let varrefs0 = [];
                    let name = playground.args[0];
                    let code = playground.args[1];
                    let testcode = playground.args[2];
                    chr.select(modSelect$1, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(name)
                            }]
                    }, select => {
                        let varrefs1 = varrefs0.slice();
                        Match.match(name, select.args[0], varrefs1).wait(name => {
                            if (Constraint.allAlive([
                                    playground,
                                    select
                                ])) {
                                chr.remove(select);
                                body(name, code, testcode);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        (() => {
            let body = t => {
                chr.cont(() => {
                    Utils.assign(t, performance.now());
                });
            };
            chr.addConstraintListener(modTimestamp$1, [new Var()], timestamp => {
                let varrefs0 = [];
                let t = timestamp.args[0];
                if (Constraint.allAlive([timestamp])) {
                    chr.remove(timestamp);
                    body(t);
                }
            });
        })();
        (() => {
            let body = () => {
                var t = new Var();
                chr.cont([
                    () => {
                        console.log(t.deref());
                    },
                    () => {
                        chr.add(modTimestamp, [t.deref()]);
                    }
                ]);
            };
            chr.addConstraintListener(modTime$0, [], time => {
                let varrefs0 = [];
                if (Constraint.allAlive([time])) {
                    chr.remove(time);
                    body();
                }
            });
        })();
        (() => {
            let body = (e, v) => {
                chr.cont(() => {
                    e.setValue(v);
                });
            };
            chr.addConstraintListener(modSetEditorValue$2, [
                new Var(),
                new Var()
            ], setEditorValue => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    let elem = setEditorValue.args[0];
                    let v = setEditorValue.args[1];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(elem)
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let e = editor.args[1];
                        Match.match(elem, editor.args[0], varrefs1).wait(elem => {
                            if (Constraint.allAlive([
                                    editor,
                                    setEditorValue
                                ])) {
                                chr.remove(setEditorValue);
                                $cont = false;
                                body(e, v);
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                new Var(),
                new Var()
            ], editor => {
                if (chr.has(modSetEditorValue$2, 1)) {
                    let varrefs0 = [];
                    let elem = editor.args[0];
                    let e = editor.args[1];
                    chr.select(modSetEditorValue$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(elem)
                            }]
                    }, setEditorValue => {
                        let varrefs1 = varrefs0.slice();
                        let v = setEditorValue.args[1];
                        Match.match(elem, setEditorValue.args[0], varrefs1).wait(elem => {
                            if (Constraint.allAlive([
                                    editor,
                                    setEditorValue
                                ])) {
                                chr.remove(setEditorValue);
                                body(e, v);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        (() => {
            let body = e => {
                chr.cont(() => {
                    e.clearSelection();
                });
            };
            chr.addConstraintListener(modClearSelection$1, [new Var()], clearSelection => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    let elem = clearSelection.args[0];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(elem)
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let e = editor.args[1];
                        Match.match(elem, editor.args[0], varrefs1).wait(elem => {
                            if (Constraint.allAlive([
                                    editor,
                                    clearSelection
                                ])) {
                                chr.remove(clearSelection);
                                $cont = false;
                                body(e);
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                new Var(),
                new Var()
            ], editor => {
                if (chr.has(modClearSelection$1, 1)) {
                    let varrefs0 = [];
                    let elem = editor.args[0];
                    let e = editor.args[1];
                    chr.select(modClearSelection$1, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(elem)
                            }]
                    }, clearSelection => {
                        let varrefs1 = varrefs0.slice();
                        Match.match(elem, clearSelection.args[0], varrefs1).wait(elem => {
                            if (Constraint.allAlive([
                                    editor,
                                    clearSelection
                                ])) {
                                chr.remove(clearSelection);
                                body(e);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        (() => {
            let body = id => {
                var e;
                chr.cont([
                    () => {
                        chr.add(modEditor, [
                            id,
                            e
                        ]);
                    },
                    () => {
                        e.getSession().setMode('ace/mode/javascript');
                    },
                    () => {
                        e.setTheme('ace/theme/monokai');
                    },
                    () => {
                        e = ace.edit(id);
                    }
                ]);
            };
            chr.addConstraintListener(modInitEditor$1, [new Var()], initEditor => {
                let varrefs0 = [];
                Var.wait(initEditor.args[0], id => {
                    if (Constraint.allAlive([initEditor])) {
                        chr.remove(initEditor);
                        body(id);
                    }
                });
            });
        })();
        (() => {
            let body = (e, f) => {
                chr.cont(() => {
                    e.getSession().on('change', f);
                });
            };
            chr.addConstraintListener(modOnEditorChange$2, [
                new Var(),
                new Var()
            ], onEditorChange => {
                if (chr.has(modEditor$2, 1)) {
                    let varrefs0 = [];
                    let id = onEditorChange.args[0];
                    let f = onEditorChange.args[1];
                    chr.select(modEditor$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(id)
                            }]
                    }, editor => {
                        let varrefs1 = varrefs0.slice();
                        let $cont = true;
                        let e = editor.args[1];
                        Match.match(id, editor.args[0], varrefs1).wait(id => {
                            if (Constraint.allAlive([
                                    editor,
                                    onEditorChange
                                ])) {
                                chr.remove(onEditorChange);
                                $cont = false;
                                body(e, f);
                            }
                        });
                        return $cont;
                    });
                }
            });
            chr.addConstraintListener(modEditor$2, [
                new Var(),
                new Var()
            ], editor => {
                if (chr.has(modOnEditorChange$2, 1)) {
                    let varrefs0 = [];
                    let id = editor.args[0];
                    let e = editor.args[1];
                    chr.select(modOnEditorChange$2, {
                        'check': Constraint.alive,
                        'index': [{
                                'i': 0,
                                'f': Index.eq(id)
                            }]
                    }, onEditorChange => {
                        let varrefs1 = varrefs0.slice();
                        let f = onEditorChange.args[1];
                        Match.match(id, onEditorChange.args[0], varrefs1).wait(id => {
                            if (Constraint.allAlive([
                                    editor,
                                    onEditorChange
                                ])) {
                                chr.remove(onEditorChange);
                                body(e, f);
                            }
                        });
                        return true;
                    });
                }
            });
        })();
        let expand = function (self, ebs) {
            let exp = self.expanded;
            ebs.forEach(e => {
                e.parentNode.parentNode.style.flexBasis = '20%';
                e.expanded = false;
                e.className = replaceAll(e.className, 'fa-minus', 'fa-plus');
            });
            if (exp !== true) {
                self.parentNode.parentNode.style.flexBasis = '90%';
                self.expanded = true;
                self.className += ' fa-minus';
            }
        };
        let replaceAll = function (str, search, replacement) {
            return str.split(search).join(replacement);
        };
        let ensureForEach = function (ns) {
            if (ns.forEach)
                return ns;
            ns.forEach = function (f) {
                let n = ns.length;
                for (let i = 0; i < n; i++) {
                    f(ns[i]);
                }
                ;
            };
            return ns;
        };
        (() => {
            let body = () => {
                var ebs, e = new Var();
                chr.cont([
                    () => {
                        ebs.forEach(e => {
                            e.onclick = function () {
                                expand(this, ebs);
                            };
                        });
                    },
                    () => {
                        ebs = ensureForEach(ebs);
                    },
                    () => {
                        ebs = document.querySelectorAll('.editorEnlarge');
                    }
                ]);
            };
            chr.addConstraintListener(modEditorEnlarge$0, [], editorEnlarge => {
                let varrefs0 = [];
                if (Constraint.allAlive([editorEnlarge])) {
                    chr.remove(editorEnlarge);
                    body();
                }
            });
        })();
        (() => {
            let body = codes => {
                var c = new Var();
                chr.cont([
                    () => {
                        chr.add(modTime, []);
                    },
                    () => {
                        chr.add(modOnEditorChange, [
                            'editorExec',
                            () => {
                                module.setText('exec', 'Execute');
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOnEditorChange, [
                            'editorOut',
                            () => {
                                module.setText('inject', 'Inject');
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOnEditorChange, [
                            'editor',
                            () => {
                                module.setText('compile', 'Compile');
                            }
                        ]);
                    },
                    () => {
                        chr.add(modEditorEnlarge, []);
                    },
                    () => {
                        chr.add(modInitEditor, ['editorExec']);
                    },
                    () => {
                        chr.add(modInitEditor, ['editorOut']);
                    },
                    () => {
                        chr.add(modInitEditor, ['editor']);
                    },
                    () => {
                        chr.add(modOnhoverText, [
                            'exec',
                            'Execute'
                        ]);
                    },
                    () => {
                        chr.add(modOnhoverText, [
                            'inject',
                            'Inject'
                        ]);
                    },
                    () => {
                        chr.add(modOnhoverText, [
                            'compile',
                            'Compile'
                        ]);
                    },
                    () => {
                        chr.add(modOnclick, [
                            'clearOutput',
                            () => {
                                resolve.clear();
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOnclick, [
                            'exec',
                            () => {
                                resolve.exec();
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOnclick, [
                            'inject',
                            () => {
                                resolve.inject();
                            }
                        ]);
                    },
                    () => {
                        chr.add(modOnclick, [
                            'compile',
                            () => {
                                resolve.compile();
                            }
                        ]);
                    },
                    () => {
                        chr.add(modSelect, [0]);
                    },
                    () => {
                        sel.onchange = function () {
                            resolve.select(this[this.selectedIndex].value);
                        };
                    },
                    () => {
                        codes.forEach((c, i) => {
                            resolve.playground(c.name, c.code, c.testcode);
                        });
                    },
                    () => {
                        chr.add(modRemoveOptions, ['codeselect']);
                    }
                ]);
            };
            chr.addConstraintListener(modInit$1, [new Var()], init => {
                let varrefs0 = [];
                let codes = init.args[0];
                if (Constraint.allAlive([init])) {
                    chr.remove(init);
                    body(codes);
                }
            });
        })();
    };
    let init = (chr, modbase, modname = 'Playground') => {
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
        temp.onhoverText = temp.onhoverText || function () {
            chr.addConstraint(modname + '.onhoverText', arguments);
        };
        temp.removeChildren = temp.removeChildren || function () {
            chr.addConstraint(modname + '.removeChildren', arguments);
        };
        temp.removeOptions = temp.removeOptions || function () {
            chr.addConstraint(modname + '.removeOptions', arguments);
        };
        temp.getText = temp.getText || function () {
            chr.addConstraint(modname + '.getText', arguments);
        };
        temp.setText = temp.setText || function () {
            chr.addConstraint(modname + '.setText', arguments);
        };
        temp.compile = temp.compile || function () {
            chr.addConstraint(modname + '.compile', arguments);
        };
        temp.compiled = temp.compiled || function () {
            chr.addConstraint(modname + '.compiled', arguments);
        };
        temp.editor = temp.editor || function () {
            chr.addConstraint(modname + '.editor', arguments);
        };
        temp.setDisabled = temp.setDisabled || function () {
            chr.addConstraint(modname + '.setDisabled', arguments);
        };
        temp.setEditorValue = temp.setEditorValue || function () {
            chr.addConstraint(modname + '.setEditorValue', arguments);
        };
        temp.clearSelection = temp.clearSelection || function () {
            chr.addConstraint(modname + '.clearSelection', arguments);
        };
        temp.inject = temp.inject || function () {
            chr.addConstraint(modname + '.inject', arguments);
        };
        temp.exec = temp.exec || function () {
            chr.addConstraint(modname + '.exec', arguments);
        };
        temp.setDisplay = temp.setDisplay || function () {
            chr.addConstraint(modname + '.setDisplay', arguments);
        };
        temp.clear = temp.clear || function () {
            chr.addConstraint(modname + '.clear', arguments);
        };
        temp.onclick = temp.onclick || function () {
            chr.addConstraint(modname + '.onclick', arguments);
        };
        temp.playground = temp.playground || function () {
            chr.addConstraint(modname + '.playground', arguments);
        };
        temp.select = temp.select || function () {
            chr.addConstraint(modname + '.select', arguments);
        };
        temp.timestamp = temp.timestamp || function () {
            chr.addConstraint(modname + '.timestamp', arguments);
        };
        temp.time = temp.time || function () {
            chr.addConstraint(modname + '.time', arguments);
        };
        temp.initEditor = temp.initEditor || function () {
            chr.addConstraint(modname + '.initEditor', arguments);
        };
        temp.onEditorChange = temp.onEditorChange || function () {
            chr.addConstraint(modname + '.onEditorChange', arguments);
        };
        temp.editorEnlarge = temp.editorEnlarge || function () {
            chr.addConstraint(modname + '.editorEnlarge', arguments);
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
        playground(chr, mod, res, modbase, modname);
        return {
            base: modbase,
            module: mod,
            resolve: res,
            modname: modname
        };
    };
    let Playground = {};
    Playground.VERSION = version;
    Playground.init = init;
    return Playground;
});
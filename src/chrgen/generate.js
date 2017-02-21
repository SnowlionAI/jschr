(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Gen = factory();
    }
}(this, function() {
    'use strict';
    var version = "0.0.1";

    var checks = require('./checks.js');

    let ES6 = true;

    let bodyname = '_body';

    var getMemberArgs = function(e) {
        if (checks.isCallExpression(e)) {
            var res = getMemberArgs(e.callee);
            return res;
        } else if (checks.isMemberExpression(e)) {
            var res = getMemberArgs(e.object);
            res.push(e.property.name);
            return res;
        } else {
            return [e.name];
        }
    }

    var makeMember = function(args) {
        args = Array.isArray(args) ? args : [args];
        return makeRawMember(args.map(makeId));
    }

    var makeRawMember = function(args) {
        args = Array.isArray(args) ? args : [args];
        return makeCompMemExp(args.map(function(arg) {
            return {
                name: arg,
                computed: false
            }
        }))
    }

    var makeCompMemExp = function(args) {
        args = Array.isArray(args) ? args : [args];
        if (args.length < 1)
            throw "makeMember can not have less than 2 agruments";
        let e = args.pop();
        // let n = (e.name === undefined && e.computed === undefined) ? (e.name.type === 'Identifier' ? e.name : makeId(e.name) : e.name;
        let n = (e.name === undefined && e.computed === undefined) ? e : e.name;
        n = typeof n === "string" ? makeId(n) : n;
        if (args.length == 0) {
            return n;
        }
        else {
            let comp = !!e.computed;
            return makeMemberExpr(makeCompMemExp(args),n,comp);
        }
    }


    var makeMemberExpr = function(o,p,comp=false) {
        return {
                "type": "MemberExpression",
                "computed": comp,
                "object": o,
                "property": p
        };
    }


    var makeHandleConstraint = function(params, body) {
        return makeVar('handleConstraint', makeFunc(params.map(makeId), body));
    }

    var makeWaitPad = function() {
        return makeVar('wp', makeNew(['WaitPad'], []));
    }

    // var makeContDecl = function() {
    //     return makeVar('cont', makeObject([]));
    // }

    // var makeMatch = function(consiname, argindex, lit) {
    //     return makeIf(
    //                 makeUnary('!',
    //                     makeCall(["rh", "__matchArg"], [
    //                         makeId(consiname), makeLit(argindex), lit
    //                     ]),
    //                     true),
    //                 makeRet(makeMember(['rh', '__cont'])));
    // }

    // var matchAllArg = function(carg) {
    //     var me = [{
    //        name: makeId(carg.consiname)
    //     }, {
    //         name: makeCompMemExp(['Constraint','args'])
    //     }, {
    //         name: makeLit(carg.index),
    //         computed: true
    //     }];
    //     return makeCompMemExp(me);
    // }



    var makeMatchLitAndWait = function(arg,lit,refs,params,body) {
        let res =
            makeExprRawCall(
                makeRawMember(
                    [makeCall(['Match','match'],[matchAllArg({consiname:arg.iname,index:arg.index}),lit,makeId(refs)]),makeId('wait')]
                ),
                [makeFunc(params.map(makeId),body)]
            );
        return [res];
    }

    var makeMatchAllAndWait = function(name,arr,args,refs,body) {
        let margs = args.map(matchAllArg);
        let marr = arr.map(makeId);
        let all = marr.concat(margs);
        let res;
        if (all.length == 2) {
            res = makeExprRawCall(
                makeRawMember(
                    [makeCall(['Match','match'],all.concat([makeId(refs)])),makeId('wait')]
                ),
                [makeFunc([makeId(name)],body)]
            );
            // res = makeExprRawCall(
            //         [makeCall(['Match','match'],[matchAllArg({consiname:arg.iname,index:arg.index}),lit,makeId(refs)]),makeId('wait')]
            //     ),
            //     makeRawMember(
            //         [makeCall(['Match','match'],all.concat([makeId(refs)])],makeId('wait')]
            //     ),
            //     [makeFunc([makeId(name)],body)]
            // );
       }
       else {
            res = makeExprRawCall(
                makeRawMember(
                    [makeCall(['Match','matchAll'],[makeArray(marr.concat(margs)),makeId(refs)]),makeId('wait')]
                ),
                [makeFunc([makeId(name)],body)]
            );
        }
        return [res];
    }

    var matchAllArg = function(carg) {
        return makeMemberExpr(
                // makeMemberExpr(
                //     makeId(carg.consiname),
                //     makeMemberExpr(
                //         makeId('Constraint'),
                //         makeId('argsSym')
                //     ),
                //     true
                // ),
                makeId(carg.consiname),
                makeId('_$' + carg.index)
                /*, true*/
        );
    }


    var makeWaitVars = function(vs,curVarRes,cont) {
        cont = Array.isArray(cont) ? cont : [cont];
        if (vs.length == 0)
            return cont;
        // console.log('args:',JSON.stringify(vs));
        var args = vs.map(v => v.struct ? makeId(v.name) : matchAllArg(v));
        var names = vs.map(v => makeId(v.name));
        let res;
        if (vs.length == 1) {
            args.push(makeFunc(names,cont));
            res = makeExprCall(['Var','wait'],args);
        }
        else {
            res = makeExprRawCall(
                makeRawMember(
                    [makeCall(['Var','all'],[makeArray(args)]),makeId('waitApply')]
                ),
                [makeFunc(names,cont)]
            );
        }
        return [res];
    }

    var makeDerefWaitVars = function(vs,curVarRes,cont) {
        cont = Array.isArray(cont) ? cont : [cont];
        if (vs.length == 0)
            return cont;

        var args = vs.map(v => v.struct ? makeId(v.name) : matchAllArg(v));
        var names = vs.map(v => makeId(v.name));
        let res;
        if (vs.length == 1) {
            args.push(makeId(curVarRes));
            args.push(makeFunc(names,cont));
            res = makeExprCall(['Match','derefWait'],args);
        }
        else {
            res = makeExprRawCall(
                makeRawMember(
                    [makeCall(['Match','derefWaitAll'],[makeArray(args),makeId(curVarRes)]),makeId('waitApply')]
                ),
                [makeFunc(names,cont)]
            );
        }
        return [res];
    }

    var makeDerefs = function(vs,curVarRes,cont) {
        // if (derefs.length <= 0)
        //     return Array.isArray(cont) ? cont : [cont];

        //     return [makeDerefs(derefs,'varrefs0',fcontGuardBody())];

        cont = Array.isArray(cont) ? cont : [cont];
        if (vs.length == 0)
            return cont;

        var args = vs.map(makeId);
        var names = args;

        let res;
        let restArgs = [makeId(curVarRes),makeFunc(names,cont)];
        if (vs.length === 1) {
            res = makeExprCall(['VarRef','deref'],args.concat(restArgs));
        }
        else
            res = makeExprCall(['VarRef','derefAll'],[makeArray(args)].concat(restArgs));
        return [res];
    }


    var makeConstraintVar = function(arg) {
        var me = [{
            name: makeId(arg.consiname)
        }, {
            name: makeId('args')
        }, {
            name: makeLit(arg.index),
            computed: true
        }, {
            name: makeId('valueOf')
        }];

        return makeVarAssign(makeId(arg.name), makeRawCall(makeCompMemExp(me, []), []));
    }


    var makeCont = function(cargs, body) {
        return makeIf(
                makeCall(['Constraint','allAlive'], [makeArray(cargs.map(makeId))]),
                makeBlock(body)
                );
    }

    var makeContGuard = function(gargs, body) {
        // var vs = gargs.map(function(a) { return makeAssign(makeMember(['rh',a]),makeCall(['rh',a,'valueOf'], [])); });

        // var vs = gargs.map(function(a) {
        //     return makeAssign(makeId(a), makeCall([a, 'valueOf'], []));
        // });
        return [makeIf(
            makeCall('guard', gargs.map(makeId)),
            makeBlock(body/*.concat([makeRet(makeLit(true))])*/)
        )];
    }


    var makeGuard = function(params, args) {
        args = args || [];
        return makeVar('guard', makeFunc(params.map(makeId), [makeRet(makeLogArgs(args))]));
    }


    var retTrue = function() {
        return makeRet(makeId('true'));
    }

    var makeContBody = function(bargs) {
        // var bs = bargs.map(function(a) {
        //     return makeAssign(makeId(a), makeCall([a, 'valueOf'], []));
        // });
        // return bs.concat([ makeExpr(makeCall('body', bargs.map(makeId))) ]);
        return [ makeExpr(makeCall(bodyname, bargs.map(makeId))) ];
    }

    var makeBody = function(base, bos, args,reserveds,inames) {
        var res = [];
        var vars;
        let bosf = bos.filter(b => (reserveds.indexOf(b.name) === -1 && inames.indexOf(b.name) === -1) && !b.allArrowParam);
        if (bosf.length)
            vars = makeVars(bosf.map(function(bo) {
                let n = bo.name;
                let nv = makeNew('Var', []);
                let v = (bo.assignedTo) ? null : nv;
                return {
                    name: n,
                    value: v
                };
            }));
        args.forEach(function(arg) {
            switch (arg.type) {
                case 'AssignmentExpression':
                    res.push(makeExpr(arg));
                    // res.push(makeVarAssign(arg.left,arg.right));
                    break;
                case 'CallExpression':
                    switch (arg.callee.type) {
                        case 'Identifier':
                            if (arg.callee.varCall !== true && reserveds.indexOf(arg.callee.name) === -1) {
                                var args = [makeId(arg.callee.modname), makeArray(arg.arguments)];

                                // var expr = makeExprCall(['chr', 'add'], args);
                                var expr = makeExprCall(['module', arg.callee.name], arg.arguments);
                                res.push(expr);
                            }
                            else {
                                var mbase = getMemberArgs(arg.callee);
                                var expr = makeExprCall(mbase, arg.arguments);
                                res.push(expr);
                            }
                            break;
                        case 'MemberExpression':
                            var mbase = getMemberArgs(arg.callee);
                            var m0 = mbase[0];
                            if ((m0 == 'CHR' || m0 == 'chr') && mbase[1] == 'Modules') {
                                // var expr = makeExprCall(['chr', 'add'], [makeLit(mbase.slice(2).join('.')), makeArray(arg.arguments)]);
                                mbase.unshift('module');
                                var expr = makeExprCall(mbase, arg.arguments);
                                res.push(expr);
                            }
                            else if (m0 === 'module' || m0 === 'Var') {
                                res.push(makeExpr(arg));
                            }
                            else {
                                res.push(makeExpr(arg));
                                // var expr = makeExprCall(mbase, arg.arguments);
                                // res.push(expr);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
            }
        });
        var body;
        if (res.length <= 1) {
            var body = makeExprCall(['chr', 'cont'], [makeFunc([], res)]);
            return vars ? [vars, body] : [body];
        } else {
            var fres = res.map(function(c) {
                return makeFunc([], [c]);
            });
            fres.reverse();
            var body = makeExprCall(['chr', 'cont'], [makeArray(fres)]);
            return vars ? [vars, body] : [body];
        }
    }

    var makeContRemoveConstraints = function(argsIn,cont) {
        var rargs = argsIn.map(function(n) { return n.iname; });
        if (rargs.length == 0)
            return [];
        var iargs = rargs.map(function(n) { return makeId(n); });
        let res;
        if (iargs.length == 1) {
            res =  [makeExprCall(['chr', 'remove'], iargs)];
        }
        else {
            var mes = makeRawMember([makeArray(iargs), makeId('some')]);
            res = [makeExprCall(['chr', 'remove'], [makeArray(iargs)])];
        }

        if (cont !== undefined)
            res.push(cont);
        return res;
    }

    var GetVarID = function() {}
    var VAR_ID = new GetVarID();


    var makeRule = function(rule,indexes,fminConstr,rulebody) {

        var code = [];

        let curVarRes = 'varrefs' + rule.index;
        code.push(makeVar(curVarRes, makeArray([])));

        rule.varCode.filter(v => v.type === 'Var').forEach(v => {
            code.push(makeVar(v.name,matchAllArg(v)));
        });


        rule.lits.filter(lit => lit.type === 'VarRef').forEach(lit => {
            var vr = makeVar(lit.name,makeNew(['Match','VarRef'],[makeLit(lit.ref)]));
            code.push(vr);
        });


        var ixs = indexes.map(function(ix) {
            if (ix === VAR_ID)
                return makeNewVar();

            if (ix === null)
                return makeId(null);

            if (ix === undefined)
                return makeId(undefined);

            if (ix.constructor === Number) {
                if (ix >= 0)
                    return makeLit(ix);
                else
                    return makeUnary('-', makeLit(-ix), true);
            }

            if (ix.constructor === String)
                return makeLit(ix);

            return makeId(null);
        });


        // console.log('rule.lits:',JSON.stringify(rule.lits));
        rule.lits.filter(lit => lit.type === 'Match').reverse().forEach(lit => {
            let pc = rulebody;
            if (lit.waitVars && lit.waitVars.length > 0) {
                let wvs = lit.waitVars;
                pc = makeDerefWaitVars(wvs,curVarRes,rulebody);
            }
            rulebody = makeMatchLitAndWait(lit,lit.arg,curVarRes,['_'],pc);
        });


        rule.varCode.filter(v => v.type === 'MatchAll').forEach(v => {
            let prev = rulebody;
            rulebody = makeMatchAllAndWait(v.name,v.vars,v.args,curVarRes,prev) ;
        });

        let vs = rule.varCode.filter(v => v.type === 'VarRefWait').map(v => v.var);

        let crb = vs.length > 0 ? makeWaitVars(vs,curVarRes,rulebody) : rulebody;

        code = code.concat(crb);

        let mcode = fminConstr(code);

        let fn = rule.external ? makeLit(rule.nameArity) : makeId(rule.fullName);
        var res = makeExprCall(['chr', 'addConstraintListener'], [
            fn,
            makeArray(ixs),
            makeFunc([makeId(rule.iname)], mcode)
        ]);

        return res;
    }


    var makeRuleBody = function(rule, derefs, fcontGuardBody) {

        if (rule === undefined) {
            return makeDerefs(derefs,'varrefs0',fcontGuardBody());
        }

        var code = [];

        // var optsargs = [makeProp(makeLit('check'), makeMember(['Constraint','isAlive']))];
        var optsargs = [makeProp(makeLit('check'), makeMember(['Constraint','alive']))];
        // var optsargs = [makeProp(makeLit('check'), 
        //     makeMemberExpr(
        //         makeId('Constraint')
        //         ,'alive']))];

        if (rule.indexes) {
            var mi = rule.indexes.reduce(function(acc, idx, i) {
                if (!idx || idx === VAR_ID || idx.value === null)
                    return acc;
                var call = null;
                if (idx.lit && !idx.struct) {
                    if (idx.value.constructor === Number) {
                        if (idx.value < 0)
                            call = makeCall(['Index', idx.idxType], [makeUnary('-', makeLit(-idx.value), true)])
                        else
                            call = makeCall(['Index', idx.idxType], [makeLit(idx.value)]);
                    }
                    else {
                        call = makeCall(['Index', idx.idxType], [makeLit(idx.value)]);
                    }
                }
                if (!idx.lit)
                    call = makeCall(['Index', idx.idxType], [makeId(idx.name)]);

                if (call !== null) {
                    acc.push(makeObject([ makeProp(makeLit('i'), makeId(i)), makeProp(makeLit('f'), call) ]));
                }
                return acc;
            }, []);
            if (mi.length > 0)
                optsargs.push(makeProp(makeLit('index'), makeArray(mi)));
        }

        if (rule.idxCode)
            code.push(rule.idxCode);


        var exclCode;
        if (rule.exclCons && rule.exclCons.length > 0) {
            var exclVar = makeVar('excl', makeId('{}'));
            code.push(exclVar);
            // makeObject(
            rule.exclCons.map(function(a) {
                var me = makeMemberExpr(
                    makeId('excl'),
                    makeMemberExpr(
                        makeId(a),
                        makeMemberExpr(makeId('Constraint'),makeId('idSym')),
                        true),
                    true);
                // var m = makeMember([a, 'id']);
                // var me = makeCompMemExp([{
                //     name: makeId('excl')
                // }, {
                //     name: m,
                //     computed: true
                // }]);
                code.push(makeAssign(me, makeId('true')));
            });
            exclCode = makeId('excl');
        }


        // var init = makeAssign(makeMember(['rh', '__loccont']), makeId('true'));

        var bodycode = [];

        let curVarRes = 'varrefs' + rule.index;


        bodycode.push(makeVar('varrefs' + rule.index, makeCall(['varrefs' + (rule.index - 1),'slice'], [])));

        if (rule.retCont == 'letCont')  {
            bodycode.push(makeVar('$cont',makeId('true')));
        }

        rule.varCode.filter(v => v.type === 'Var').forEach(v => {
            bodycode.push(makeVar(v.name,matchAllArg(v)));
        });

        rule.lits.filter(lit => lit.type === 'VarRef').forEach(lit => {
            bodycode.push(makeVar(lit.name,makeNew(['Match','VarRef'],[makeLit(lit.ref)])));
        });


        var rulebody;
        if (!rule.rest) {
            let cont;
            if (rule.retCont !== 'noCont')
                cont = makeAssign(makeId('$cont'),makeId('false'));

            rulebody = makeDerefs(derefs,curVarRes,fcontGuardBody(cont));
        }
        else
            rulebody = makeRuleBody(rule.rest, derefs, fcontGuardBody);


        let vs = rule.varCode.filter(v => v.type === 'VarRefWait').map(v => v.var);
        rulebody = makeWaitVars(vs,curVarRes,rulebody);

        rule.lits.filter(lit => lit.type === 'Match').forEach(lit => {
            let pc = rulebody;
            if (lit.waitVars && lit.waitVars.length > 0) {
                let wvs = lit.waitVars;
                pc = makeDerefWaitVars(wvs,curVarRes,rulebody);
            }
            rulebody = makeMatchLitAndWait(lit,lit.arg,curVarRes,['_'],pc);
        });

        let wvs = rule.lits.filter(lit => lit.type === 'VarRefWait').map(v => v.var);
        rulebody = makeWaitVars(wvs,curVarRes,rulebody);

        rule.varCode.filter(v => v.type === 'MatchAll').forEach(v => {
            let prev = rulebody;
            rulebody = makeMatchAllAndWait(v.name,v.vars,v.args,curVarRes,prev) ;
        });

        if (rule.retCont == 'noCont')  {
            rulebody.push(makeRet(makeId('true')));
        }
        else {
            rulebody.push(makeRet(makeId('$cont')));
        }

        let fn = rule.external ? makeLit(rule.nameArity) : makeId(rule.fullName);
        var fargs = [fn, makeObject(optsargs)];

        if (exclCode)
            fargs.push(exclCode);

        fargs.push(makeFunc([makeId(rule.iname)], bodycode.concat(rulebody)));

        code.push(makeExpr(makeCall(['chr', 'select'], fargs)));

        return code;
    }


    var makeProp = function(key, value) {
        return {
            type: 'Property',
            key: key,
            value: value
        }
    }


    var getOwnProperties = function(o, f) {
        var acc = [];
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                if (!f || f(i, o[i]))
                    acc.push(o[i]);
            }
        }
        return acc;
    }



    let uniq = function(a) { return uniqBy(a, function (k) { return k; }); }

    let uniqBy = function(a, key) {
        let seen = {};
        return a.filter(function(item) {
            let k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }


    var makeInitMods = function() {
        var res = [];
        // res.push(makeAssign(makeId('modbase'),makeLogExpression("||", makeId('modbase'), makeObject([]))));
        // res.push(makeVar('mod'));
        let chmd = makeMember(['chr','Modules']);
        let chmdmn = makeCompMemExp(['chr','Modules',{computed:true,name:'modname'}]);
        let mb = makeId('base');
        res.push(makeIf(
            makeLogExpression("===", mb, makeId('undefined')),
            makeBlock([
                makeAssign(chmd,makeLogExpression("||", chmd, makeObject([]))),
                makeAssign(mb,chmd),
                ])
            ));

        let bm = makeMember(['base','module']);
        res.push(makeAssign(bm,makeLogExpression("||", bm, makeObject([]))));
        let br = makeMember(['base','resolve']);
        res.push(makeAssign(br,makeLogExpression("||", br, makeObject([]))));

        let bmmn = makeCompMemExp(['base','module',{computed:true,name:'modname'}]);
        res.push(makeAssign(bmmn,makeLogExpression("||", bmmn, makeObject([]))));
        res.push(makeVarAssign(makeId('mod'),bmmn));

        let brmn = makeCompMemExp(['base','resolve',{computed:true,name:'modname'}]);
        res.push(makeAssign(brmn,makeLogExpression("||", brmn, makeObject([]))));
        res.push(makeVarAssign(makeId('res'),brmn));

        return res;
    }

    var makeInit = function(base, funcs, constrs, reserveds) {
        let initMods = makeInitMods();
        let initFuncs = funcs.map(f => makeInitFunc(f.name));
        let temp = makeVarAssign(makeId('temp'),makeObject([]));

        let cs = getOwnProperties(constrs);
        let initContrs = uniq(cs.map(c => c.callee ? c.callee.name : c.name)).map(makeInitConstraint);

        // let res = makeVarAssign(makeId('res'),makeObject([]));
        let modRes = makeForTempModRes();

        let body = initMods.concat([temp],initContrs,[modRes],initFuncs);

        // let retObj = makeObject([ makeProp(makeId('base'), makeId('modbase')), makeProp(makeId('module'), makeId('mod')), makeProp(makeId('resolve'), makeId('res')), makeProp(makeId('modname'), makeId('modname')) ]);
        body.push(makeRet(makeId('base')));

        // let n = makeLit(base.slice(2).join('.'));

        let n = base.slice(2).join('.');
        let defaults = [null,Gen.makeLit(n),null]

        let initFunc = makeFunc([makeId('chr'),makeId('modname'),makeId('base')], body,defaults);
        return makeProp(makeId('init'), initFunc);
    }

    var makeInitFunc = f => makeExpr(makeRawCall(makeId(f), [makeId('chr'),makeId('mod'),makeId('res'),makeId('base'),makeId('modname')]));

    var makeInitConstraint = function(name) {
        // var mbase = base.slice();
        // var pname = base.length > 2 ? base.slice(2).join('.') + '.' + name : name;
        // mbase.shift();
        // mbase.unshift('chr');
        // mbase.push(name);
        var me = makeMember(['temp',name]);
        return makeAssign(me,
            makeLogExpression('||', me,
                makeFunc([], [
                    // makeExprCall(['chr', 'addConstraint'], [
                    makeExprCall(['chr', 'add'], [
                            makeBinaryExpr('+', makeId('modname'),makeLit('.' + name)),
                            makeId('arguments')
                        ])
                ], [], false)
            )
        );
    }

    var makeForTempModRes = function() {
        let left = makeVar('i');
        let right = makeId('temp');
        let modi = makeCompMemExp(['mod',{computed:true,name:'i'}]);
        let mass = makeAssign(modi, makeLogExpression('||', modi, makeId('f')));

        let fapply = makeExprCall(['f','apply'],[makeLit('null'),makeId('arguments')]);
        let fapplyf = makeFunc([],[fapply]);
        let func = makeVar('fres',fapplyf);
        let resol = makeExprCall(['chr','resolveOne'],[makeId('fres')]);
        let fbody = [func,resol];

        let resi = makeCompMemExp(['res',{computed:true,name:'i'}]);
        let fres = makeFunc([],fbody,[],false);
        let rass = makeAssign(resi,fres);

        let body = [
            makeVar('f',makeCompMemExp(['temp',{computed:true,name:'i'}])),
            mass,
            rass/*,
            fapply*/
        ];

        return makeForIn(left,right,makeBlock(body));
    }


    var propsToVars = function(ps) {
        return [];
    }


    var makeMinConstraints = function(arr,body) {
        if (arr.length === 0)
            return body;

        var logs = makeLogArgs(
            arr.map(a => {
                let n = a.external ? makeLit(a.nameArity) : makeId(a.modNameArity);
                return makeCall(['chr','has'],[n,makeId(a.count)]);
            } )
        );
        return [makeIf(logs, makeBlock(body))];
    }

    var makeAssign = function(left, right) {
        return {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": left,
                "right": right
            }
        }
    }

    var makeForIn = function(left, right, body, each=false) {
        return {
            "type": "ForInStatement",
            "left": left,
            "right": right,
            "body": body,
            "each": makeId(each)
        }
    }


    var makeExprCall = function(ns, args) { return makeExpr(makeCall(ns, args)); }
    var makeExprRawCall = function(ns, args) { return makeExpr(makeRawCall(ns, args)); }

    var makeExpr = function(expr) {
        return {
            "type": "ExpressionStatement",
            "expression": expr
        };
    }

    var makeCall = function(ns, args) {
        return makeRawCall(makeMember(ns), args);
    }

    var makeRawCall = function(me, args) {
        return {
            "type": "CallExpression",
            "callee": me,
            "arguments": args
        };
    }

    var makeVarAssign = function(left, right) {
        let type = ES6 ? 'let' : 'var';
        return {
            "type": "VariableDeclaration",
            "declarations": [{
                "type": "VariableDeclarator",
                "id": left,
                "init": right
            }],
            "kind": type
        };
    }

    var makeVar = function(n, expr = null) {
        let type = ES6 ? 'let' : 'var';
        return {
            "type": "VariableDeclaration",
            "declarations": [{
                "type": "VariableDeclarator",
                "id": makeId(n),
                "init": expr
            }],
            "kind": type
        };
    }

    var makeVars = function(nvs) {
        return {
            "type": "VariableDeclaration",
            "declarations": nvs.map(function(nv) {
                return {
                    "type": "VariableDeclarator",
                    "id": makeId(nv.name),
                    "init": nv.value
                };
            }),
            "kind": "var"
        };
    }


    var makeNewVar = function(ns, args) {
        return makeNew(['Var'], args);
    }

    var makeNew = function(fs, args) {
        args = args || [];
        return {
            "type": "NewExpression",
            "callee": makeMember(fs),
            "arguments": args
        };
    }


    var makeLit = function(lit) {
        return {
            "type": "Literal",
            "value": lit,
            "raw": "" + lit
        };
    }

    var makeId = function(n) {
        return {
            "type": "Identifier",
            "name": n
        };
    }

    var makeFunc = function(params, body, defaults = [], kind = ES6) {
        let type = kind ? "ArrowFunctionExpression" : "FunctionExpression"
        return {
            "type": type,
            "id": null,
            "params": params,
            "defaults": defaults,
            "body": {
                "type": "BlockStatement",
                "body": body
            },
            "generator": false,
            "expression": false
        };
    }

    var makeArray = function(arr) {
        return {
            "type": "ArrayExpression",
            "elements": arr
        }
    }

    var makeObject = function(props) {
        return {
            "type": "ObjectExpression",
            "properties": props
        }
    }

    var makeRet = function(val) {
        return {
            "type": "ReturnStatement",
            "argument": val
        }
    }

    var makeIf = function(test, cons, alt=null) {
        return {
            "type": "IfStatement",
            "test": test,
            "consequent": cons,
            "alternate": alt
        };
    }

    var makeBlock = function(bs) {
        return {
            "type": "BlockStatement",
            "body": bs
        }
    }


    var makeLogExpression = function(op, left, right) {
        return {
            "type": "LogicalExpression",
            "operator": op,
            "left": left,
            "right": right
        };
    }


    var makeBinaryExpr = function(op, left, right) {
        return {
            "type": "BinaryExpression",
            "operator": op,
            "left": left,
            "right": right
        };
    }

    var makeUnary = function(op, arg, prefix) {
        prefix = prefix !== undefined ? prefix : true;
        return {
            "type": "UnaryExpression",
            "operator": op,
            "argument": arg,
            "prefix": prefix
        }
    }

    let makeConditional = function(test,cons,alt) {
        return {
                    "type": "ConditionalExpression",
                    "test": test,
                    "consequent": cons,
                    "alternate": alt
        };
    }


    // var makeBoolean = function(v) {
    //     return makeLit(v);
    // }

    var makeLogArgs = function(args) {
        if (args.length == 0)
            return makeBoolean(true);
        else if (args.length == 1)
            return args[0];
        else if (args.length == 2)
            return makeLogArg(args[0], args[1]);
        else {
            var a12 = args.splice(0, 2);
            args.unshift(makeLogArg(a12[0], a12[1]));
            return makeLogArgs(args);
        }
    }

    var makeLogArg = function(left, right) {
        return makeLogExpression('&&', left, right);
    }


    let makeThis = { "type": "ThisExpression" }

    let makeHeader = function(ns,func) {
        let ms = [];
        for (let i = 1; i < ns.length; i++) {
            let sub = ns.slice(0,i);
            let msub = makeMember(['root'].concat(sub));
            ms.push(makeAssign(msub,makeLogExpression("||", msub, makeObject([]))));
        }
        ms.push(makeAssign(makeMember(['root'].concat(ns)),makeCall('factory',makeArray([]))));
        return makeExprRawCall(
                makeFunc(
                    ['root','factory'].map(makeId),
                    [
                            makeIf(
                                makeLogExpression('&&',makeBinaryExpr('===',makeUnary('typeof',makeId('define'),true),makeLit('function')),makeMember(['define','amd'])),
                                makeBlock([makeExprCall(['define'],[makeArray([]),makeId('factory')])]),
                                makeIf(
                                    makeBinaryExpr('===',makeUnary('typeof',makeId('exports')),makeLit('object')),
                                    makeBlock([makeAssign(makeMember(['module','exports']),makeCall('factory',makeArray([])))]),
                                    makeBlock(ms)
                                )
                            )
                    ])
                ,
                [makeThis,func]);
    }

    let upper = function(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

   let lower = function(s) {
        return s.charAt(0).toLowerCase() + s.slice(1);
    };


    let makeRequire = function(n) {
        return makeVarAssign(makeId(upper(n)),makeCall('require',[makeLit('/' + lower(n) + '.js')]));
    }



    /* export */
    var Gen = {
        Checks: checks,
        getMemberArgs: getMemberArgs,
        makeId: makeId,
        makeLit: makeLit,
        makeVar:makeVar,
        makeVarAssign:makeVarAssign,
        makeAssign: makeAssign,
        makeExpr:makeExpr,
        makeUnary: makeUnary,
        makeBinaryExpr:makeBinaryExpr,
        makeConditional: makeConditional,
        makeNew:makeNew,
        makeCall:makeCall,
        makeRawCall:makeRawCall,
        makeExprCall:makeExprCall,
        makeExprRawCall:makeExprRawCall,
        makeFunc:makeFunc,
        makeInit:makeInit,
        makeConstraintVar:makeConstraintVar,
        makeContRemoveConstraints:makeContRemoveConstraints,
        makeContBody:makeContBody,
        makeContGuard:makeContGuard,
        makeCont:makeCont,
        makeGuard:makeGuard,
        makeBody:makeBody,
        makeRule:makeRule,
        makeRuleBody:makeRuleBody,
        makeHandleConstraint:makeHandleConstraint,
        makeMember:makeMember,
        makeMemberExpr:makeMemberExpr,
        makeCompMemExp:makeCompMemExp,
        // makeMatch:makeMatch,
        makeArray:makeArray,
        makeDerefs:makeDerefs,
        makeMinConstraints:makeMinConstraints,
        makeWaitVars:makeWaitVars,
        propsToVars:propsToVars,
        makeRet:makeRet,
        makeObject:makeObject,
        makeHeader:makeHeader,
        makeRequire:makeRequire,
        bodyname: bodyname,
        // makeMatchAllArgs:makeMatchAllArgs,
        VAR_ID: VAR_ID,
        VERSION: version
    };
    return Gen;
}));




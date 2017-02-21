(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Compiler = factory();
    }
}(this, function() {
    'use strict';
    let version = "0.0.1";

    let Checks = require('./checks.js');
    let Gen = require('./generate.js');

    let esrecurse = require('esrecurse');
    let escodegen = require('escodegen');
    let esprima = require('esprima');


    const Settings = {
      IGNORE_UNDERSCORE: true,
      IGNORE_UNDERSCORE_START: true,
    };


    let countCons = function(args) {
        let acc = {};
        args.forEach(function(arg) {
            let n;
            if (arg.type == 'CallExpression')
                n = arg.callee.name;
            else if (arg.type == 'Identifier')
                n = arg.name;
            n in acc ? acc[n]++ : acc[n] = 1;
        });
        return acc;
    }

    let getCons = function(cons) {
        let acc = {};
        let arr = [];
        let counted = countCons(cons);
        let vars = {}
        cons.forEach(function(con,idx) {
            let name;
            let args;
            let arity;
            let external = con.external === true ? true : false;
            if (con.type == 'CallExpression') {
                name = con.callee.name;
                args = con.arguments;
                arity = con.arguments.length;
            }
            else if (con.type == 'Identifier') {
                name = con.name
                args = [];
                arity = 0;
            }
            let i = '';
            if (counted[name] > 1) {
                name in acc ? acc[name]++ : acc[name] = 1;
                i = acc[name];
            }
            let iname = external ? name.replace(/\./g, "_") + i : name + i;
            if (con.type == 'CallExpression')
                con.callee.iname = iname;
            if (con.type == 'Identifier')
                con.iname = iname;
            let nameArity = name + '/' + arity;
            let loc = con.loc;
            args = args.map(procConArg);
            arr.push({ name:name, iname:iname, arity:arity, nameArity:nameArity, index:idx, args:args, constraint:true, loc:loc, external:external });
        });
        return arr;
    }


    let procConArg = function(arg,i) {
        if (arg.type === 'Identifier' && arg.name === 'undefined') {
            return { value:undefined, index:i, arg:arg, struct:false, lit:true };
            // return { value:undefined, index:i, arg:{ raw:'undefined', type:'Literal', value:undefined }, struct:false, lit:true };
            // return { name:arg.name, index:i, arg:arg, struct:false, lit:false };
        }
        else  if (arg.type === 'Identifier') {
            return { name:arg.name, index:i, arg:arg, struct:false, lit:false };
        }
        else if (arg.type === 'Literal') {
            return { value:arg.value, index:i, arg:arg, struct:false, lit:true };
        }
        else if (arg.type === 'UnaryExpression' && arg.operator === '-') {
            return { value:- arg.argument.value, index:i, arg:arg, struct:false, lit:true };
        }
        else {
            let res = extractConVars(arg,i);
            return { vars:res.vars, accs:res.accs, index:i, arg:arg, struct:true, lit:true };
        }
    }

    let extractConVars = function(ast,i) {
        let vars = [];
        let accs = {};
        esrecurse.visit(ast, {
            CallExpression: function (node) {
                let self = this;
                node.arguments.forEach(function(n) {
                    self.visit(n.value);
                })
            },
            Identifier: function (node) {
                let v = { name:node.name, arg:node, index:i, struct:true, lit:true };
                vars.push(v);
                if (!accs[v.name])
                    accs[v.name] = [];
                accs[v.name].push(v);
            },
            ObjectExpression: function(node) {
                let self = this;
                node.properties.forEach(function(n) {
                    self.visit(n.value);
                })
            },
            ArrayExpression: function(node) {
                let self = this;
                node.elements.forEach(function(n) {
                    self.visit(n);
                });
            }
        });
        return { vars:vars, accs:accs };
    }


    let getUniqParams = function(params) {
        let acc = [];
        let seen = {};
        params.forEach(function (p) {
                let args = {}
                args[p.iname] = p.args;
                let r = {name:p.name, iname:[p.iname], arity:p.arity, nameArity:p.nameArity, count:1, args:p.args };
                seen[p.name] = r;
                acc.push(r);

        });
        return acc;
    }


    let getBodyCons = function(args) {
        let res = [];
        args.forEach(function(arg) {
            switch (arg.type) {
                case 'CallExpression':
                    let name, arity, nameArity;
                    switch (arg.callee.type) {
                        case 'Identifier':
                            let base = getPath(arg.callee);
                            name = base.join('.');
                            arity = arg.arguments.length;
                            nameArity = name + '/' + arity;
                            res.push({name:name, arity:arity, nameArity:nameArity, args:arg.arguments, constraint:true});
                            break;
                        case 'MemberExpression':
                            let mbase = getPath(arg.callee);
                            let constraint;
                            name;
                            if (mbase.length > 2 && mbase[0] == 'CHR' && mbase[1] == "Modules") {
                                name = mbase.slice(2).join('.');
                                constraint = true;
                            }
                            else {
                                name = mbase.join('.');
                                constraint = false;
                            }
                            arity = arg.arguments.length;
                            nameArity = name + '/' + arity;
                            res.push({name:name, arity:arity, nameArity:nameArity, args:arg.arguments, constraint:constraint});
                            break;
                        default:
                            break;
                    }
                    break;
            }
        });
        return res;
    }

    let getPath = function(e) {
        if (Checks.isMemberExpression(e)) {
            let res = getPath(e.object);
            res.push(e.property.name);
            return res;
        }
        else {
            return [e.name];
        }
    }



    let addConstraints = function(constrs,arr) {
        arr.forEach(function(con) {
            let key = con.nameArity;
            if (con.constraint && !con.external && !(key in constrs))
                constrs[key] = con;
        });
    }


    let getVars = function(cons) {
        let vars = [];
        cons.forEach(function(con) {
            con.args.forEach(function(arg,i) {
                if (!arg.lit) {
                    let v = { consname:con.name, consiname:con.iname, name:arg.name, index:i, arg:arg.arg, struct:false, lit:false, loc:con.loc };
                    vars.push(v);
                }
                else if (!arg.struct) {
                    // let v = { consname:con.name, consiname:con.iname, name:arg.name, index:i, arg:arg.arg, struct:false, lit:true, loc:con.loc };
                    // vars.push(v);
                    // return [v];
                }
                else {
                    arg.vars.forEach(function(v) {
                        extend(v, { consname:con.name, consiname:con.iname, index:i, struct:true, lit:true, loc:con.loc });
                    });
                    arg.vars.forEach(function(v) { vars.push(v) });
                }
            });
        });
        return vars;
    }


    let getGBArgs = function(args,loc,hvars,reserveds,inames,rinames) {
        let acc = [];
        let inUse = false;
        let arrowParams = false;
        args.forEach(function(ast,i) {
            let assignedTo = false;
            esrecurse.visit(ast, {
                CallExpression: function (node) {
                    let self = this;
                    let mas = Gen.getMemberArgs(node.callee);
                    mas.forEach(ma => {
                        if (hvars.some(v => v.name === ma) || (reserveds.indexOf(ma) !== -1 || acc.some(v => v.name === ma) /*  || (inames.indexOf(mas[0]) !== -1)*/)) {
                            let v = { name:ma, loc:loc };
                            if (v.loc == 'body') {
                                // if (assignedTo) {
                                //     v.assignedTo = true;
                                //     v.node = args[i];
                                // }
                                // if (inUse)
                                    v.inUse = inUse;
                            }
                            node.callee.varCall = true;
                            v.node = node;
                            v.index = i;
                            acc.push(v);
                        }
                    });
                    if (mas.length > 1 && inames.indexOf(mas[0]) !== -1) {
                        rinames.push(mas[0]);
                    }
                    // if (mas.length > 1) {
                    //     let n = node.callee.object;
                    //     while (n.callee) {
                    //         if (n.type === 'CallExpression') {
                    //             n.arguments.forEach(n => { self.visit(n); });
                    //             // if (n.callee.computed)
                    //             // self.visit(n.callee.property);
                    //         }
                    //         if (n.callee.type === 'MemberExpression') {
                    //             if (n.callee.computed)
                    //                 self.visit(n.callee.property);
                    //         }

                    //         n = n.callee.object;
                    //     }
                    // }
                    node.arguments.forEach(function(n) {
                        self.visit(n);
                    })
                },
                ArrowFunctionExpression: function (node) {
                    let self = this;
                    arrowParams = true;
                    node.params.forEach(function(n) {
                        self.visit(n);
                    })
                    arrowParams = false;
                    self.visit(node.body);
                },
                FunctionExpression: function (node) {
                    let self = this;
                    arrowParams = true;
                    node.params.forEach(function(n) {
                        self.visit(n);
                    })
                    arrowParams = false;
                    self.visit(node.body);
                },
                MemberExpression: function (node) {
                    // let self = this;
                    procMemberExprGBArgs(node,node,i,loc,inUse,acc,this,hvars,inames,rinames);
                },
                Identifier: function (node) {
                    let v = { name:node.name, loc:loc };
                    if (v.loc == 'body') {
                        v.arrowParam = arrowParams;
                        v.node = node;
                        let n = args[i];
                        if (assignedTo && n.left.type !== 'MemberExpression') {
                            v.assignedTo = true;
                            v.node = n;
                        }
                        // if (inUse)
                            v.inUse = inUse;
                    }
                    v.index = i;
                    acc.push(v);
                    if (inames.some(i => i === node.name))
                        rinames.push(node.name)

                    // node = true;
                },
                ObjectExpression: function(node) {
                    let self = this;
                    node.properties.forEach(function(n) {
                        self.visit(n.value);
                    })
                },
                ArrayExpression: function(node) {
                    let self = this;
                    node.elements.forEach(function(n) {
                        self.visit(n);
                    });
                },
                BinaryExpression: function (node) {
                    let oldInUse;
                    if (loc == 'body') {
                        oldInUse = inUse;
                        inUse = true;
                    }
                    this.visit(node.left);
                    // mode = 'body';
                    this.visit(node.right);
                    if (loc == 'body') {
                        inUse = oldInUse;
                    }
                },
                AssignmentExpression: function (node) {
                // console.log(mode + ':' +  astToString((node)));
                    assignedTo = true;
                    this.visit(node.left);
                    assignedTo = false;
                    let oldInUse;
                    if (loc == 'body') {
                        oldInUse = inUse;
                        inUse = true;
                    }
                    this.visit(node.right);
                    if (loc == 'body') {
                        inUse = oldInUse;
                    }
                }

            });
        });
        return acc;
    }

    let removeUnderscoreVars = function(vs,iu=Settings.IGNORE_UNDERSCORE, ius=Settings.IGNORE_UNDERSCORE_START) {
      return vs.filter(v => !(v.name.startsWith('_') && (ius || (iu && v.name.length === 1))));
    };



    let procMemberExprGBArgs = function(node,orgNode,i,loc,inUse,acc,visitor,hvars,inames,rinames) {
        if (node.computed === true)
            visitor.visit(node.property);
        if (node.object.type === 'MemberExpression')
            procMemberExprGBArgs(node.object,orgNode,i,loc,inUse,acc,visitor,hvars,inames,rinames);
        else if (node.object.type === 'Identifier') {
            let n = node.object.name;
            if (hvars.some(v => v.name === n )/* || inames.some(i => i === n)*/) {
                let v = { name:n, loc:loc };
                if (v.loc == 'body') {
                    v.inUse = inUse;
                }
                v.index = i;
                acc.push(v);
            }
            else if (acc.some(v => v.name === n)) {
                let v = { name:n, loc:loc };
                if (v.loc == 'body') {
                    v.inUse = inUse;
                }
                v.node = orgNode;
                v.index = i;
                acc.push(v);
            }
            if (inames.some(i => i === n)) {
                rinames.push(n);
            }
        }
        // let mas = Gen.getMemberArgs(node);
        // if (mas.length > 0 && hvars.some(v => v.name === mas[0])) {
        //     let v = { name:mas[0], loc:loc };
        //     if (v.loc == 'body') {
        //         // if (assignedTo) {
        //         //     v.assignedTo = true;
        //         //     v.node = args[i];
        //         // }
        //         // if (inUse)
        //             v.inUse = inUse;
        //     }
        //     v.index = i;
        //     acc.push(v);
        // }
    }




    let uniq = function(a) { return uniqBy(a, function (k) { return k; }); }

    let uniqBy = function(a, key) {
        let seen = {};
        return a.filter(function(item) {
            let k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }

    let getBodyCallArgs = function(hargs,bargs) {
        let acc = [];
        let nacc = [];
        bargs.forEach(function(arg) {
            let samename = function(n) { return arg.name == n.name; };
            if (hargs.some(samename))
                acc.push(arg.name);
            else
                nacc.push(arg.name);
        });
        return { head:acc, bodyOnly:nacc };
    }

    let getGuardArgs = function(hargs,gargs) {
        let acc = [];
        hargs.forEach(function(arg) {
            let samename = function(n) { return arg.name == n.name; };
            if (gargs.some(samename)) {
                acc.push(arg.name);
            }
        });
        return acc;
    }

    let makeVarMap = function(hargs,gargs,bargs) {
        let vars = {};
        let head = {};
        let headCons = {};
        let guard = {};
        let body = {};
        let p = function(obj,k,v) { k in obj ? obj[k].push(v) : (obj[k] = [v]); }

        hargs.forEach(function(v) {
            let n = v.name;
            p(vars,n,v);
            p(head,n,v);
            if (!(v.consiname in headCons))
                headCons[v.consiname] = {}
            if (!(v.index in headCons[v.consiname]))
                headCons[v.consiname][v.index] = [];
            headCons[v.consiname][v.index].push(v);
        });
        gargs.forEach(function(v) {
            let n = v.name;
            p(vars,n,v);
            p(guard,n,v);
        });
        bargs.forEach(function(v) {
            let n = v.name;
            p(vars,n,v);
            p(body,n,v);
        });

        return {vars:vars,head:head,headCons:headCons,guard:guard,body:body,refs:{}};
    }


    let isCHRModule = function(ms) { return ms.length > 2 && ms[0] === 'CHR' && ms[1] === 'Modules'; };

    let setFuncParams = function(params) {
        params.length = 0;
        params.push({name:'chr',type:'Identifier'});
        params.push({name:'module',type:'Identifier'});
        params.push({name:'resolve',type:'Identifier'});
        params.push({name:'base',type:'Identifier'});
        params.push({name:'modname',type:'Identifier'});
    }

    let reserved = ['modname','modbase','base','module','resolve','chr','CHR','Var','undefined','null','document'];

    let compile = function(node) {
        let useHeader = true;
        if (Checks.isAssignment(node)) {
            let expr = node.expression;
            if (Checks.isCHRExpression(expr)) {
                let lhs = expr.left;
                let ms = Gen.getMemberArgs(lhs);
                if (isCHRModule(ms)) {
                    let version = false;
                    let rhs = expr.right;
                    let props;
                    if (Checks.isObjectExpression(rhs)) {
                        props = rhs.properties;

                        let constrs = {};
                        let initFuncs = [];
                        let retBody = [];
                        props.forEach(function(prop) {
                            let key = prop.key;
                            if (key.name === 'version')
                                version = true;
                            let func = prop.value;
                            let funcname = key.name;
                            let locConstrs = {};
                            let singleCons = [];
                            if (Checks.isFunctionExpression(func) && Checks.isBlockStatement(func.body)) {
                                initFuncs.push(key);

                                setFuncParams(func.params);

                                let fb = func.body;
                                let bs = fb.body;
                                let bodies = [];
                                let vardecls = [];
                                // if (bs.length == 1) {
                                //     let expr = bs[0];
                                //     let scs = splitConstr(expr);
                                //     let body = procExpr(ms,funcname,scs,locConstrs);
                                //     let bexpr = Gen.makeExprRawCall(Gen.makeFunc([], body),[]);
                                //     bodies.push(bexpr);
                                // }
                                // else {
                                bs.forEach(function(expr) {
                                    if (expr.type !== 'ExpressionStatement') {
                                        expr.declarations.forEach(v => {
                                            if (v.id && v.id.type === 'Identifier') {
                                                vardecls.push(v.id.name);
                                            }
                                        });
                                        fixResolve(expr);
                                        bodies.push(expr);
                                    }
                                    else if (expr.expression.type === 'AssignmentExpression') {
                                        if (expr.expression.left && expr.expression.left.type === 'Identifier')
                                            vardecls.push(expr.expression.left.name);
                                        fixResolve(expr);
                                        bodies.push(expr);
                                    }
                                    else if (expr.expression.type === 'Identifier') {
                                        let n = expr.expression.name
                                        vardecls.push(expr.expression.name);
                                        let c = { name:n, iname:n, arity:0, nameArity:n+'/0', index:0, args:[], constraint:true, loc:'body', external:false, noRS:true };
                                        singleCons.push(c);
                                    }
                                    else {
            // let mn = modName(c);
            // let mna = modNameArity(c,'$');
                                        fixResolve(expr);
                                        let scs = splitConstr(expr);
                                        if (scs.body.length === 0 && scs.removed.length === 0) {
                                            let cons = getCons(scs.kept);
                                            singleCons = singleCons.concat(cons);
                                        }
                                        else {
                                            let scsns = scs.kept.concat(scs.removed).map(c => {
                                                if (c.type === 'Identifier')
                                                    return ({name:c.name,arity:0})
                                                else
                                                    return ({name:c.callee.name,arity:c.arguments.length})
                                            });
                                            // vardecls = vardecls.concat(scsns.map(modName),scsns.map(c => modNameArity(c,'$')));
                                            let rscsns = scsns.filter(c => c.external === true);
                                            let rs = reserved.concat(vardecls,rscsns.map(modName),rscsns.map(c => modNameArity(c,'$')));
                                            let rvd = reserved.concat(vardecls);
                                            let body = procExpr(ms,funcname,scs,locConstrs,rs,rvd);
                                            let bexpr = Gen.makeExprRawCall(Gen.makeFunc([], body),[]);
                                            bodies.push(bexpr);
                                        }
                                    }
                                });
                                    // fb.body = bodies;
                                // }

                                let cons = [];
                                let rs = reserved.concat(vardecls);

                                Object.keys(locConstrs)./*filter(k => rs.indexOf(k) === -1).*/forEach(k => {
                                    let c = locConstrs[k];
                                    if (rs.indexOf(c.name) === -1 || c.noRS === true) {
                                        constrs[k] = c;
                                        cons.push(c);
                                    }
                                });

                                let mfix = modnameFix();
                                let modns = makeModNames(cons.filter(c => rs.indexOf(c.name) === -1 || c.noRS === true));
                                let modnsin = makeModNames(singleCons);

                                bodies = [mfix].concat(modns,modnsin,bodies);

                                prop.value = Gen.makeFunc(func.params,bodies);
                            }

                        });

                        let init = Gen.makeInit(ms,initFuncs,constrs);
                        props.push(init);
                        let vars = propsToVars(props);
                        let retObj = makeRetObject(ms,version);
                        let reqs = ['Constraint','Var','Index','Match','Utils'].map(Gen.makeRequire);
                        vars = [].concat(useStrict(),reqs,vars,retObj);

                        retBody = vars;

                        // let func = Gen.makeRawCall(Gen.makeFunc([], retBody),[]);
                        let func = Gen.makeFunc([], retBody);

                        let vres;
                        if (useHeader) {
                            let ns = ms.slice(2);
                            vres = Gen.makeHeader(ns,func);
                        }
                        else {
                            vres = Gen.makeVar(n,Gen.makeRawCall(func,[]));
                        }
                        node.expression = undefined;
                        for (let i in vres) {
                            node[i] = vres[i];
                        }
                    }
                }
            }
        }
        return false;
    }




    let useStrict = function() { return Gen.makeExpr(Gen.makeLit('use strict')); }


    let makeRetObject = (ms,version) => {
        let arr = [];
        // let n = ms.slice(2).join('.');
        let n = ms[ms.length - 1];
        let nid = Gen.makeId(n);
        arr.push(Gen.makeVar(n,Gen.makeObject([])));
        if (version)
            arr.push(Gen.makeAssign(Gen.makeMember([n,'VERSION']),Gen.makeId('version')));
            // arr.push(Gen.makeAssign(Gen.makeMember([n,'VERSION'],Gen.makeId('version'))));
        arr.push(Gen.makeAssign(Gen.makeMember([n,'init']),Gen.makeId('init')));
        // arr.push(Gen.makeAssign(Gen.makeMember([n,'modbase']),Gen.makeId('modbase')));
        // arr.push(Gen.makeAssign(Gen.makeMember([n,'module']),Gen.makeId('mod')));
        // arr.push(Gen.makeAssign(Gen.makeMember([n,'modname']),Gen.makeId('modname')));
        arr.push(Gen.makeRet(Gen.makeId(n)));
        return arr;
    }

    let propsToVars = arr => arr.map(a =>
        Gen.makeVar(a.key.name,a.value));

    // let entries = function(obj) { return Object.keys(obj).map(function(k) { return { key:k,value:obj[k] }; }); }

    let values = function(obj) { return Object.keys(obj).map(function(k) { return obj[k]; }); }

    let extend = function (target, source) {
      target = target || {};
      for (let prop in source) {
        if (typeof source[prop] === 'object') {
          target[prop] = extend(target[prop], source[prop]);
        } else {
          target[prop] = source[prop];
        }
      }
      return target;
    }


    let copy = function(s,t) {
        Object.keys(s).forEach(k => { t[k] = s[k] });
    }

    let makeIndex = function(gs,a) {
        if (!a.lit && !a.struct) {
            let g = gs.find((e,i) => {
                return e.opf === 'eq' && ((e.left && e.left.name === a.name) || (e.right && e.right.name === a.name));
            })
            if (g !== undefined) {
                return g.left.value || g.right.value;
            }
            else {
                return Gen.VAR_ID;
            }
        }
        if (a.lit && !a.struct)
            return a.value;
        if (a.struct) {
            if (a.arg.type === 'UnaryExpression' && a.arg.operator === '-' ) {
                return (- a.arg.argument.value);
            }
        }
        return '$struct';
    }

    let opfTable = {
        '==': 'eq',
        '===': 'eq'/*,
        '!=': 'neq',
        '!==': 'neq',
        '>':'gt',
        '<':'lt',
        '>=':'gte',
        '<=':'lte'*/
    }

    let opOpfTable = {
        '==': 'eq',
        '===': 'eq'/*,
        '!=': 'neq',
        '!==': 'neq',
        '>':'lt',
        '<':'gt',
        '>=':'lte',
        '<=':'gte'*/
    }


    let classifyBodyGuardVars = function(hvars,varmap) {
        hvars.forEach(function(v) {
            let n = v.name;
            if (varmap.body[n] !== undefined) {
                if (varmap.body[n].some(function(bv) { return bv.inUse; })) {
                    v.wait = true;
                    v.inUse = true;
                    v.inBody = true;
                    return true;
                }
                v.inBody = true;
            }
            if (varmap.guard[n] !== undefined) {
                v.wait = true;
                v.inGuard = true;
                return true;
            }
            return false;
        });
    }

    let makeIdxGuard = function(guard,guardVars) {
        let idxGuard = [];

        guard.forEach(function(g,i) {
            if (g.type !== 'BinaryExpression')
                return;
            let opf = opfTable[g.operator]
            if (!opf)
                return;
            let gvs = Object.keys(guardVars).filter(function (k) {
                return guardVars[k].some(function(v) {
                    return v.index === i;
                });
            });
            if (gvs.length === 0)
                return;
            let res = {vars:gvs, op:g.operator, opf:opf, guard:g };
            if (g.left.type == 'Identifier')
                res.left = { name:g.left.name }
            else if (g.left.type == 'Literal' && (g.left.value === null || g.left.value.constructor == Number || g.left.value.constructor == String))
                res.left = { value:g.left.value}
            if (g.right.type == 'Identifier')
                res.right = { name:g.right.name }
            else if (g.right.type == 'Literal' && (g.right.value === null || g.right.value.constructor == Number || g.right.value.constructor == String))
                res.right = { value:g.right.value}
            if (!res.left || !res.right)
                return;
            idxGuard.push(res)
        });

        return idxGuard;
    }



    let getWaitVars = function(varmap,vgbody) {
        let waitVars = [];
        // handle non struct args - 4 cases: 1. also in struct 2. referenced later 3. more than 1 occurrence 4. single occurrence
        Object.keys(varmap.head).forEach(function(k) {
            let struvs = varmap.head[k].filter(function(v) { return v.struct });
            if (struvs.length === 1 && struvs[0].wait)
                waitVars.push(struvs[0]);

            let vs = varmap.head[k].filter(function(v) { return !v.struct });
            if (vs.length == 0)     // nothing to do
                return;
            if (vs.length < varmap.head[k].length) {  // vars already exposed for struct
                // let u = Gen.makeMatchAllArgs([k],vs);
                // vgbody.push(u);
                return;
            }
            let v;
            if (vs.some(function(v) { return v.inBody || v.inGuard; })) {   // expose vars referenced later
                v = vs.shift();
                let cv = Gen.makeConstraintVar({name:v.name,consiname:v.consiname,index:v.index})
                vgbody.push(cv);
            }
            if (vs.length > 1 || (v && vs.length > 0)) {    // non-single non-struct vars in head > 1
                // let arr = v ? [v.name] : [];                // already referenced ?
                // let u = Gen.makeMatchAllArgs(arr,vs);
                // vgbody.push(u);
                return;
            }
            if (v && vs.length == 0 && v.wait) {            // single non-struct vars not already waited for
                waitVars.push(v);
                return;
            }
        });
        return waitVars;
    }

    let capFirst = function(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    let modName = function(c) {
        return 'mod' + capFirst(c.name);
    }

    let modNameArity = function(c,slash='') {
        return modName(c) + slash + c.arity;
    }

    let makeModNames = function(hcons) {
        let arr = [];
        let seen = {};
        uniqBy(hcons, function(c) { return c.name + '#' + c.arity; }).forEach(function(c) {
        // uniqBy(hcons, function(c) { return c.name; }).forEach(function(c) {
            let n = c.name;
            let arity = c.arity;
            let mn = modName(c);
            let mna = modNameArity(c,'$');
            // let mnsa = modNameArity(c,true);
            if (!seen[mn]) {
                arr.push(Gen.makeVarAssign(Gen.makeId(mn),Gen.makeBinaryExpr('+',Gen.makeId('pointedname'),Gen.makeLit(n))));
                seen[mn] = true;
            }
            arr.push(Gen.makeVarAssign(Gen.makeId(mna),Gen.makeBinaryExpr('+',Gen.makeId(mn),Gen.makeLit('/' + arity))));
        });
        return arr;
    }

    let makeMinConstraints = function(hcons,u) {
        var arr = [];
        uniqBy(hcons, function(c) { return c.name + '#' + c.arity; }).forEach(function(c) {
        // uniqBy(hcons, function(c) { return c.name; }).forEach(function(c) {
            let filt = hcons.filter(cc =>
                c.name === cc.name && c.arity === cc.arity);
            let count = filt.length;
            if (count === 1 && u.name === filt[0].name && u.arity === filt[0].arity)
                return;
            // let n = c.name;
            // let arity = c.arity;
            // let mn = modName(c);
            let mna = modNameArity(c,'$');
            // let mnsa = modNameArity(c,true);
            // arr.push(Gen.makeMinConstraints(mna, count)Gen.makeId(mn),Gen.makeBinaryExpr('+',Gen.makeId('modname'),Gen.makeLit(n))));
            // arr.push(Gen.makeVarAssignment(Gen.makeId(mna),Gen.makeBinaryExpr('+',Gen.makeId(mn),Gen.makeLit('/' + arity))));
            arr.push({modNameArity:mna,nameArity:c.nameArity,count:count,external:c.external});
        });

        // if (arr.length === 0)
        //     return function(body) { return body; };

        return function(body) { return Gen.makeMinConstraints(arr,body); };
    }


    let modnameFix = function() {
        return Gen.makeVarAssign(
            Gen.makeId('pointedname'),
            Gen.makeConditional(Gen.makeId('modname'),Gen.makeBinaryExpr('+',Gen.makeId('modname'),Gen.makeLit('.')),Gen.makeLit(''))
            );
    }

    let removedKept = function(hcons) {
        let kept = hcons.filter(c => c.loc === 'kept');
        let rem = hcons.filter(c => c.loc === 'removed');
        return rem.concat(kept);
    }

    let procExpr = function(base,funcname,acc,constrs,reserveds,resvardecls) {
        let body = [];

        // let headcons = acc.removed.concat(acc.kept);
        let headcons = acc.kept.concat(acc.removed);

        let hcons = getCons(headcons);
        addConstraints(constrs,hcons);

        // body.push(modnameFix());

        // var modns = makeModNames(hcons);
        // body = body.concat(modns);

        // if (acc.removed.length === 0 && acc.body.length === 0)
        //     return;

        let bcons = getBodyCons(acc.body);
        addConstraints(constrs,bcons)

        let vgbody = [];

        let inames = Object.keys(hcons).map(k => hcons[k].iname);

        let hvars = getVars(hcons);

        let ginames = [];
        let gvars = getGBArgs(acc.guard,'guard',hvars,reserveds,inames,ginames);

        let binames = [];
        let bvars = getGBArgs(acc.body,'body',hvars,reserveds,inames,binames);

        hvars = removeUnderscoreVars(hvars);
        gvars = removeUnderscoreVars(gvars);
        bvars = removeUnderscoreVars(bvars);

        let namef = function(a) { return a.name; };
        let ugvars = uniqBy(gvars, namef);
        let ubvars = uniqBy(bvars, namef);



        let varmap = makeVarMap(hvars,gvars,bvars);
        // makeAliases(varmap);

        values(varmap.vars).forEach(function(arr) { arr[0].single = (arr.length == 1); });


        // sanity check: do not allow orphan variables in guard, which are not in head
        let orphanVars = Object.keys(varmap.guard).filter(k => !varmap.head[k]);
        if (orphanVars.length > 0) {
            // throw new Error("error in " + base.join('.') + '.' + funcname + ": orphanVars [" + orphanVars.join(',') + "] in guard and not in head.")
        }

        classifyBodyGuardVars(hvars,varmap);



        // let gparams = uniq(getGuardArgs(hvars,ugvars));
        // let gparams = uniq(Object.keys(varmap.guard).filter(k => varmap.head[k] || (inames.indexOf(k) !== -1)));
        let gparams = uniq(Object.keys(varmap.guard).filter(k => varmap.head[k]).concat(ginames));

        // let bparams = uniq(Object.keys(varmap.body).filter(k => varmap.head[k] || (inames.indexOf(k) !== -1)));
        let bparams = uniq(Object.keys(varmap.body).filter(k => varmap.head[k]).concat(binames));

        let removedArgs = hcons.filter(function(n) { return n.loc == 'removed'; });


        // console.log('varmap:',JSON.stringify(varmap));
        let fcontGuardBody = function(contFalse) {
            let contRemCons = Gen.makeContRemoveConstraints(removedArgs,contFalse);
            let contBody = acc.body.length ? contRemCons.concat(Gen.makeContBody(bparams)) : contRemCons;
            let contAll;
            if (acc.guard.length) {
                contAll = Gen.makeContGuard(gparams,contBody);
            }
            else
                contAll = contBody;

            let vparams = hcons.map(function(p) { return p.iname });

            let contGuardBody = Gen.makeCont(vparams,contAll);

            return contGuardBody;
        }


        if (acc.guard.length) {
            let guardCode = Gen.makeGuard(gparams,acc.guard,ugvars);
            body.push(guardCode);
        }

        let bodyOnlyVars;
        if (acc.body.length) {
            replaceBodyAssignment(acc.body,varmap);
            bodyOnlyVars = uniq(Object.keys(varmap.body).filter(k => !varmap.head[k])).map(k => varmap.body[k][0]);
            let bovsf = bodyOnlyVars.filter(b => reserveds.indexOf(b.name) === -1 && inames.indexOf(b.name) === -1 && b.assignedTo !== true);

            bovsf.forEach(v => {
                let n = v.name;
                let nn = Gen.makeCall([n,'deref'],[]);
                if (!varmap.body[n].some(sv => sv.arrowParam)) {
                    varmap.body[n].forEach(bv => {
                        let node = bv.node;
                        while (node && node.type !== 'Identifier') {
                            if (node.type === 'CallExpression')
                                node = node.callee;
                            else if (node.type === 'MemberExpression')
                                node = node.object;
                        }
                        if (!node)
                            return;
                        node.type = undefined;
                        node.name = undefined;
                        for (let k in nn) {
                            if (nn.hasOwnProperty(k)) {
                                node[k] = nn[k];
                            }
                        }
                    });
                }
            });
            bodyOnlyVars.forEach(b => {
                if (varmap.body[b.name].every(sv => sv.arrowParam))
                    b.allArrowParam = true;
            });
            replaceConstraintCalls(acc.body,resvardecls);
            let bodyCode = Gen.makeBody(base,bodyOnlyVars,acc.body,reserveds,inames);
            let bodyFunc = Gen.makeVar(Gen.bodyname, Gen.makeFunc(bparams.map(Gen.makeId),bodyCode));
            body.push(bodyFunc);
        }

        // console.log('varmap.head:',JSON.stringify(varmap.head));

        let idxGuard = makeIdxGuard(acc.guard,varmap.guard);

        let remKeptCons = removedKept(hcons);
        remKeptCons.forEach(function(u,i) {
            let ups = remKeptCons.slice();
            ups.splice(i,1);

            // let rups = rearrange(ups);
            ups.unshift(u);

            let introduced = {};
            let varid = 0;
            let removed = 'noCont';
            let derefs = [];
            let cs = procCons(base,ups,0,introduced,varid,{},removed,derefs,idxGuard,varmap);

            let idxs = u.args.map(function(a) { return makeIndex(idxGuard,a); });

            let rulebody = Gen.makeRuleBody(cs.rest,derefs,fcontGuardBody);

            let fminConstr = makeMinConstraints(hcons,u);
            let ug = Gen.makeRule(cs,idxs,fminConstr,rulebody);

            body.push(ug);
        });

        return body;
    }



    let procCons = function(base,cons,i,intro,id,seen,retCont,derefs,idxGuard,varmap) {
        if (cons.length == i)
            return;
        let con = cons[i];

        let fullName = modNameArity(con,'$'); // base.length > 2 ? base.slice(2).join('.') + '.' + con.nameArity: con.nameArity;

        let o = {name:con.name,iname:con.iname,nameArity:con.nameArity,index:i,fullName:fullName,lits:[],varCode:[],con:con,external:con.external};

        con.args.filter(arg => arg.lit).forEach(arg => {
            let l;
            let waitVars = [];
            if (arg.struct) {
                Object.keys(arg.accs).forEach(k => {
                    let vs = arg.accs[k];
                    let used = vs.length > 0; // some(function(v) { return v.inUse || v.inGuard || varmap.head[k] > 1 });
                    intro[k] = id;
                    seen[k] = true;
                    o.lits.push({type:'VarRef',name:k,ref:id});
                    if (vs.length == 1) {
                        if ((vs[0].inUse || vs[0].inGuard))
                            waitVars.push(vs[0]);
                        else {
                            let nstrs = varmap.head[k].every(v => v.struct === true);
                            if (nstrs)
                                derefs.push(k);

                        }
                    }
                    id++;
                });
            }
            o.lits.push({type:'Match',iname:con.iname, index:arg.index, arg:arg.arg, waitVars:waitVars});
        });

        let vs = con.args.filter(arg => !arg.lit);
        vs = removeUnderscoreVars(vs);
        let cvs = vs.map(v => { v.consiname = con.iname; return v; });
        let gvs = cvs.reduce((acc,v) => {
            acc[v.name] ? acc[v.name].push(v) : (acc[v.name] = [v]);
            return acc;
        },{});

        // if (i > 0) {
            let idxs = [];
            let hasIdx = false;
            con.args.forEach(a => {
                if (!a.lit) {
                    let n = a.name;
                    if (seen[n]) {
                        if (!intro[n]) {
                            o.idxCode = o.idxCode || [];
                            let cv = Gen.makeConstraintVar({name:a.name,consiname:a.consiname,index:a.index})
                            o.idxCode.push(cv);
                            intro[n] = true;
                        }
                        idxs.push({ idxType:'eq',lit:false,name:n });
                        hasIdx = true;
                        return;
                    }
                    else {
                        let argHasIdx = false;
                        idxGuard.forEach(function(ig) {
                            if (argHasIdx || ig.left === undefined || ig.right === undefined)
                                return;
                            if (ig.left.name == a.name) {
                                let r = ig.right
                                if (r.value) {
                                    idxs.push({idxType:ig.opf,lit:true,value:r.value });
                                    hasIdx = true;
                                    argHasIdx = true;
                                    return;
                                }
                                else if (seen[r.name]) {
                                    if (!intro[r.name]) {
                                        let mvs = vars.filter(function(v) { return v.name === r.name; });
                                        if (mvs.length === 0)
                                            return;
                                        let v = mvs[0];
                                        o.idxCode = o.idxCode || [];
                                        let cv = Gen.makeConstraintVar({name:v.name,consiname:v.consiname,index:v.index})
                                        o.idxCode.push(cv);
                                        intro[r.name] = true;
                                    }
                                    let op = ig.op
                                    idxs.push({idxType:ig.opf,lit:false,name:r.name });
                                    hasIdx = true;
                                    argHasIdx = true;
                                    return;

                                }
                            }
                            else if (ig.right.name == a.name) {
                                let l = ig.left;
                                if (l.value) {
                                    idxs.push({idxType:opOpfTable[ig.op],lit:true,value:l.value });
                                    hasIdx = true;
                                    argHasIdx = true;
                                    return;
                                }
                                else if (seen[ig.left.name]) {
                                    if (!intro[l.name]) {
                                        let mvs = vars.filter(function(v) { return v.name === l.name; });
                                        if (mvs.length === 0)
                                            return;
                                        let v = mvs[0];
                                        o.idxCode = o.idxCode || [];
                                        let cv = Gen.makeConstraintVar({name:l.name,consiname:v.consiname,index:v.index})
                                        o.idxCode.push(cv);
                                        intro[l.name] = true;
                                    }
                                    let op = ig.op
                                    idxs.push({idxType:opOpfTable[ig.op],lit:false,name:l.name });
                                    hasIdx = true;
                                    argHasIdx = true;
                                    return;
                                }
                            }
                        });
                        if (!argHasIdx)
                            idxs.push(null);
                    }
                }
                else {
                    if (!a.struct) {
                        idxs.push({idxType:'eq',lit:true,struct:false,value:a.value });
                        hasIdx = true;
                        return;
                    }
                    else if (a.struct && a.arg.type === 'UnaryExpression' && a.arg.operator === '-' ) {
                        idxs.push({idxType:'eq',lit:true,struct:false,value:a.arg.argument.value });
                        hasIdx = true;
                        return;
                    }
                    else
                        idxs.push(null);
                }
            });

            if (hasIdx)
                o.indexes = idxs;
        // }

        Object.keys(gvs).forEach(function(k) {
            let vs = gvs[k];
            // console.log('vs:',JSON.stringify(vs));
            if (intro[k] !== undefined) {
                // let u = Gen.makeMatchAllArgs([k],vs);
                o.varCode.push({type:'MatchAll',name:k,vars:[k],args:vs});
                return;
            }
            let cv = vs.shift();
            let v = varmap.head[cv.name][0];
            // let hoccs = varmap.head[k].filter(v => !v.struct);


            if (vs.length > 1 || (v && vs.length > 0)) {    // non-single non-struct vars in head > 1
                let arr = v ? [v.name] : [];                // already referenced ?
                intro[v.name] = true;
                seen[v.name] = true;
                o.varCode.push({type:'Var',name:v.name,consiname:v.consiname,index:v.index});
                o.varCode.push({type:'MatchAll',name:k,vars:arr,args:vs});
            }
            else {
                if (v.inUse || v.inGuard) {
                    intro[v.name] = true;
                    seen[v.name] = true;
                    o.varCode.push({type:'VarRefWait',var:cv});
                }
                else {
                    intro[cv.name] = true;
                    seen[cv.name] = true;
                    o.varCode.push({type:'Var',name:cv.name,consiname:cv.consiname,index:cv.index});
                }

            }
        });

        if (i !== 0) {
            o.exclCons = cons.slice(0,i).filter(c => c.name == con.name).map(c => c.iname);
        }

        o.retCont = retCont;

        if (retCont === 'noCont' && con.loc === 'removed') {
            retCont = 'letCont';
        }
        else if (retCont === 'letCont') {
            retCont = 'cont';
        }


        o.rest = procCons(base,cons,i+1,intro,id,seen,retCont,derefs,idxGuard,varmap);

        return o;
    }

    var isNotWaitVar = function(k,varmap) {
        let vs = varmap.head[k];
        return !vs[0].inUse;
    }

    let rearrange = function(cs) {
        return cs;
    }

    let replaceIdentifiers = function(ast) {
        if (ast.processed === true)
            return;
        esrecurse.visit(ast, {
            CallExpression: function (node) {
            },
            UnaryExpression: function (node) {
                this.visit(node.argument);
            },
            AssignmentExpression: function (node) {
            },
             BinaryExpression: function (node) {
                this.visit(node.left);
                this.visit(node.right);
            },
            SequenceExpression: function (node) {
                let self = this;
                node.expressions.forEach(function(n,i) {
                    self.visit(n);
                });
            },
            ArrayExpression: function (node) {
                let self = this;
                node.elements.forEach(function(n) {
                    self.visit(n);
                });
            },
            Property: function (node) {
                this.visit(node.value);
            },
            Identifier: function(node) {
                let m = Gen.makeMember(['rh',node.name]);
                node.name = undefined;
                node.type = m.type;
                node.object = m.object;
                node.computed = m.computed;
                node.property = m.property;
            },
            ObjectExpression: function(node) {
                let self = this;
                node.properties.forEach(function(n) {
                    self.visit(n);
                });
            }
        });
        ast.processed = true;
    }


    let replaceBodyAssignment = function(ast,varmap,vars=[]) {
        if (Array.isArray(ast)) {
            ast.forEach(function(a) { replaceBodyAssignment(a,varmap,vars); });
            return;
        }
        esrecurse.visit(ast, {
            AssignmentExpression: function (node) {
                var assign = true;
                if (node.left.type === 'Identifier') {
                    var n = node.left.name;
                    if (!varmap.head[n] && (varmap.body[n][0].assignedTo === true)) {
                        assign = false;
                        vars.push(n);
                    }
                }
                else if (node.left.type === 'MemberExpression') {
                    let mas = Gen.getMemberArgs(node.left);
                    if (mas.length > 0 && varmap.head[mas[0]] || (vars.indexOf(mas[0]) !== -1)) {
                        assign = false;
                    }
                    assign = false;
                }
                if (assign) {
                    node.type = 'CallExpression';
                    node.callee = Gen.makeMember(['Utils','assign']);
                    node.arguments = [node.left,node.right];
                    node.left = undefined;
                    node.right = undefined;
                    node.operator = undefined;
                }
            }
        });
    }

    let replaceConstraintCalls = function(ast,resvardecls,arg=false) {
        // arg = arg !== undefined ? arg : false;
        if (Array.isArray(ast)) {
            ast.forEach(function(a) { replaceConstraintCalls(a,resvardecls,arg); });
            return;
        }
        esrecurse.visit(ast, {
            CallExpression: function (node) {
                if (arg === false) {
                    node.arguments.forEach(n => {
                        replaceConstraintCalls(n,resvardecls,true);
                    });
                }
                else {
                    if (node.callee.type === 'Identifier' && !inlist(node.callee.name,resvardecls)) {
                        let n = node.callee; 
                        node.callee = Gen.makeMemberExpr(Gen.makeId('Constraint'),Gen.makeId('makeConstraint'));
                        let args = node.arguments.slice();
                        node.arguments = [Gen.makeId(modName(n)),Gen.makeArray(args)];
                    }
                }          

            }
        });
    }

    let fixResolve = function(ast,resvardecls,arg=false) {
        // arg = arg !== undefined ? arg : false;
        if (Array.isArray(ast)) {
            ast.forEach(function(a) { fixResolve(a,resvardecls,arg); });
            return;
        }
        esrecurse.visit(ast, {
            CallExpression: function (node) {
                if (node.callee.type === 'MemberExpression') {
                    let mas = Gen.getMemberArgs(node.callee);
                    if (mas.length > 2 && (mas[0] === 'resolve' || mas[0] === 'module')) {
                        mas.unshift('base');
                        node.callee = Gen.makeMember(mas);
                        return;
                    }
                }
                return;
            }
        });
    }




    let splitConstr = function(ast,acc) {
        let mode = 'kept';
        acc = acc || {kept:[],removed:[],guard:[],body:[]};
        esrecurse.visit(ast, {
            CallExpression: function (node) {
                node.loc = mode;
                if (mode === 'body' && node.callee.type === 'Identifier') {
                    node.callee.modname = modName(node.callee);
                }
                else if ((mode === 'kept' || mode === 'removed') && node.callee.type === 'MemberExpression') {
                    let mas = Gen.getMemberArgs(node);
                    let name = mas.join('.');
                    node.callee = Gen.makeId(name);
                    node.callee.modname = modName(node.callee);
                    node.external = true;
                }
                acc[mode].push(node);
            },
            UnaryExpression: function (node) {
                if (mode == 'kept' || mode == 'removed') {
                    let na = node.argument;
                    if (node.operator == '-') {
                        na.loc = 'removed';
                        let oldMode = mode;
                        mode = 'removed';
                        this.visit(na,acc);
                        mode = oldMode;
                    }
                    else if (node.operator == '+') {
                        na.loc = 'kept';
                        let oldMode = mode;
                        mode = 'kept';
                        this.visit(na,acc);
                        mode = oldMode;
                        // node.argument.loc = 'kept';
                        // // this.visit(node.argument);
                        // acc['kept'].push(node.argument);
                    }
                }
            },
            AssignmentExpression: function (node) {
                if (mode !== 'body')
                    throw new Error( 'assignement expression can only occur in body')
                node.loc = 'body';
                acc[mode].push(node);;
            },
            LogicalExpression: function (node) {
                let n = node.left;
                while (n.operator && n.operator !== '|')
                    n = n.left;
                if (n.operator && n.operator === '|') {
                    this.visit(n.left);
                    let nr = n.right;
                    n.operator = n.left = n.right = undefined;
                    copy(nr, n);
                }
                n = node.right;
                let bn;
                while (n.operator && n.operator !== '>>>')
                    n = n.right;
                if (n.operator && n.operator === '>>>') {
                    bn = n.right;
                    let nl = n.left;
                    n.operator = n.left = n.right = undefined;
                    copy(nl, n);
                }
                acc['guard'].push(node);
                mode = 'body';
                if (bn)
                    this.visit(bn);
            },
            BinaryExpression: function (node) {
                if (node.operator == '|') {
                    this.visit(node.left);
                    mode = 'guard';
                    let n = node.right;
                    let bn;
                    while (n.operator && n.operator !== '>>>')
                        n = n.right;
                    if (n.operator && n.operator === '>>>') {
                        bn = n.right;
                        let nl = n.left;
                        n.operator = n.left = n.right = undefined;
                        copy(nl, n);
                        acc['guard'].push(node.right);
                        mode = 'body';
                        this.visit(bn);
                    }
                    else {
                        this.visit(node.right);
                    }
                }
                else if (node.operator == '/') {
                    this.visit(node.left);
                    mode = 'removed';
                    this.visit(node.right);
                }
                else if (node.operator == '>>>') {
                    this.visit(node.left);
                    mode = 'body';
                    this.visit(node.right);
                }
                else {
                    if (mode == 'guard' || mode == 'body') {
                        node.loc = mode;
                        acc[mode].push(node);
                    }
                    else {
                        this.visit(node.left);
                        node.loc = mode;
                        if (node.operator == '-') {
                            node.right.loc = 'removed';
                            acc['removed'].push(node.right);
                        }
                        else if (node.operator == '+') {
                            node.right.loc = 'kept';
                            acc['kept'].push(node.right);
                        }
                        else
                            acc[mode].push(node);
                    }
                }
            },
            SequenceExpression: function (node) {
                let self = this;
                node.expressions.forEach(function(n,i) {
                    self.visit(n);
                });
            },
            MemberExpression: function (node) {
                if (mode === 'body') {
                    let n = Gen.makeCall('dummy',[]);
                    n.loc = mode;
                    n.callee = node;
                    let mas = Gen.getMemberArgs(node);
                    if (mas.length > 2 && (mas[0] === 'resolve' || mas[0] === 'module')) {
                        mas.unshift('base');
                        n.callee = Gen.makeMember(mas);
                    }
                    acc[mode].push(n);
                }
                else if (mode === 'kept' || mode === 'removed') {
                    let mas = Gen.getMemberArgs(node);
                    let name = mas.join('.');
                    let n = Gen.makeCall(name,[]);
                    n.loc = mode;
                    n.callee.modname = modName({name:name});
                    n.external = true;
                    acc[mode].push(n);
                }
            },
            ArrayExpression: function (node) {
                let self = this;
                node.elements.forEach(function(n) {
                    self.visit(n);
                });
            },
            Identifier: function(node) {
                if (mode === 'kept' || mode === 'removed' || mode === 'body') {
                    let n = Gen.makeCall(node.name,[]);
                    n.loc = mode;
                    n.callee.modname = modName(node);
                    acc[mode].push(n);
                }
            },
            Literal: function(node) {},
            ObjectExpression: function(node) {}
        });
        return acc;
    }




    // convenience function

    let inlist = function(c,cs) { return cs.indexOf(c) !== -1; };


    let astToString = function(ast) {
        return escodegen.generate(ast);
    }

    let initialcomment = '// This file is generated: DO NOT CHANGE!\n// Changes will be overwritten...\n\n';

    let parseCompileGenerate = function(js) {
        let syntax = esprima.parse(js, { comment: true });
        syntax.body.forEach(compile);
        return initialcomment + escodegen.generate(syntax, { comment: true });
    }


    /* export */
    let Compiler = {
        generate: escodegen.generate,
        compile: compile,
        parse: esprima.parse,
        parseCompileGenerate: parseCompileGenerate,
        VERSION: version
    };

    return Compiler;
}));

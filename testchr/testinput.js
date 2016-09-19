
let timescript = function(f) {
	let t0 = performance.now();
	f();
	let t1 = performance.now();	
	return t1 - t0;
}

let versionCode = 
`
version: '0.0.1',
`

let appendCode =
`    let appendDivText = function(t) {
        let d = document.createElement('div');
        d.appendChild(document.createTextNode(t));
        let output = document.getElementById('outputContainer');
        output.appendChild(d);
    };
`
let initCode = 
`
    let chr = new CHR();
    let init = Test.init(chr);
`;


var iterate = function(f,n,init) {
	let its = n;
    let mintime = Number.MAX_VALUE;
    let maxtime = Number.MIN_VALUE;
    let total = 0;

    for (let i = 0; i < its; i++) {
    	if (init !== undefined)
    		init();
    	t = timescript(f);
    	mintime = Math.min(mintime,t); 
    	maxtime = Math.max(maxtime,t);
        total += t;
    }

    appendDivText('iterations:' + its, true);
    if (its === 1) {
	    appendDivText('time:' + total,true);
    }
    else {
	    appendDivText('total time:' + total);
	    appendDivText('avg. time:' + (total / its));
	    appendDivText('min. time:' + mintime,true);
	    appendDivText('max. time:' + maxtime);
    }
}

let appendDivText = function(t,bold) {
    let d = document.createElement('div');
    if (bold)
	    d.style.fontWeight = 'bold';
    d.appendChild(document.createTextNode(t));
    let output = document.getElementById('outputContainer');
    output.appendChild(d);
};

let newline = function() {     
	let d = document.createElement('br');
    let output = document.getElementById('outputContainer');
    output.appendChild(d);
}



let eqArray = function(arr1,arr2) {
	let len1 = arr1.length;
	let len2 = arr2.length;
	if (len1 !== len2)
		return false;
	return arr1.every((a,i) => a == arr2[i]);
}

let between = function(min,max) {
	let r = Math.random();
	return min + Math.floor((max - min) * r);
}

let randomN = function(n,min=0,max=n*5) {
	let l = [];
	for (let i = 0; i < n; i++)
		l.push(between(min,max));
	return l;
}

let showArray = function(n,arrIn) {
	let arr = arrIn.slice();
	appendDivText(n + '#:' + arr.length);
	while (arr.length > 0) {
		let sel = arr.splice(50);
		appendDivText(JSON.stringify(arr));
		arr = sel;
	}
}

var wrap = f => f.toLocaleString();
var wrapExpr = f => '(' + wrap(f) + ')();';


var wrapModule = function(f,fname,mod='Test',ver='0.0.1') {
	let n = fname || f.name || 'test'; // implementations differ chrome has .name, ff not...
	return `CHR.Modules.` + mod + ` = {

	version:'` + ver +`',

  	` + n + `: ` + wrap(f) + ` 
};
`;
}

let pathTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr);

	let f = _ => { 
		chr.reset();
    	init.module.example();
		chr.resolve();
	};

	iterate(f,100);

    appendDivText('resolutions:' + chr.res);

    let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};

let pathCHRCode = function() {
        path(X,Y,L1) / path(X,Y,L2) | L1 <= L2;
        path(X,Y,L1), path(Y,Z,L2)
          | (X !== Z) >>> path(X,Z,L1+L2);

        - example >>> 
            path('London','Berlin',1100),
            path('Berlin','Vienna',650),
            path('Vienna','London',1500),
            path('Vienna','Paris',1200),
            path('Ulm','Vienna',600),
            path('Paris','Ulm',700);
    };


let path = 	{
	name:'path',
	code: wrapModule(pathCHRCode),
	testcode: wrapExpr(pathTestCode)
};


let pathVarTestCode = function() {
    let chr = new CHR();
    let path = Test.init(chr);

    let time = {total:0, min:Number.MAX_VALUE,max:Number.MIN_VALUE,cs:0};
    let init = {total:0, min:Number.MAX_VALUE,max:Number.MIN_VALUE,cs:0};
    let cities = {total:0, min:Number.MAX_VALUE,max:Number.MIN_VALUE,cs:0};
    let dist = {total:0, min:Number.MAX_VALUE,max:Number.MIN_VALUE,cs:0};

	let n = 100;

	let adjust = function(s,t,cs) {
    	s.min = Math.min(s.min,t); 
    	s.max = Math.max(s.max,t);
        s.total += t;
        s.cs = cs;
	}

	let disp = function(name,s,n) {
	    appendDivText('total ' + name + ':' + s.total);
	    appendDivText('avg. ' + name + ':' + (s.total / n));
	    appendDivText('min. ' + name + ':' + s.min,true);
	    appendDivText('max. ' + name + ':' + s.max);
	    appendDivText(name + ' constraints#:' + s.cs.length);
	    newline();
	}

    for (let i = 0; i < n; i++) {
    	chr.reset();

		let paris = new Var();
		let london = new Var();
		let l1200 = new Var();

		let module = path.module;

    	let ti = timescript(function() {
		 	module.path(paris,'Ulm',700);
			module.path('Ulm','Vienna',600);
			module.path('Vienna',paris,l1200);
			module.path('Vienna',london,1500);
			module.path('Berlin','Vienna',650);
			module.path(london,'Berlin',1100);
			chr.resolve();

    	});

    	adjust(init,ti,chr.Store.getItems());

        let tc = timescript(function() {
			paris.set('Paris');
			london.set('London2');
			chr.resolve();
        });

    	adjust(cities,tc,chr.Store.getItems());

        let td = timescript(function() {
			l1200.set(1200);
			chr.resolve();
        });

    	adjust(dist,td,chr.Store.getItems());

    	adjust(time,ti+tc+td,chr.Store.getItems());
    }

    let cs = chr.Store.getItems();

    appendDivText('iterations:' + n, true);
    newline();
    disp('total',time,n);
    disp('init',init,n);
    disp('cities',cities,n);
    disp('dist',dist,n);
    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};


let pathVarCHRCode = function() {
        path(X,Y,L1) / path(X,Y,L2) | L1 <= L2;
        path(X,Y,L1), path(Y,Z,L2)
          | (X !== Z) >>> path(X,Z,L1+L2);
};

let pathVar = 	{
	name:'pathVar',
	code: wrapModule(pathVarCHRCode),
	testcode: wrapExpr(pathVarTestCode)
};



let pathNTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr);

	let testpath_cons = [];


	function generate(n) {
		let cities = [];
		for (let i = 0; i < n; i++) {
			cities.push('City ' + i);
		}

		cities.forEach(function(c1) {
				cities.forEach(function(c2) {
					if (c1 != c2) {
						if (Math.random() < 0.2) {
							let km = between(30,500) * 10;
							testpath_cons.push([c1,c2,km]);

						}
						if (Math.random() < 0.1) {
							let km = between(300,5000);
							testpath_cons.push([c2,c1,km]);
						}
					}
				});
		});
	}

	let module = init.module;

	let n = 10;
	generate(n);

	let f = _ => { 
		chr.reset();

	 	module.path('Paris','Ulm',700);
		module.path('Ulm','Vienna',600);
		module.path('Vienna','Paris',1200);
		module.path('Vienna','London',1500);
		module.path('Berlin','Vienna',650);
		module.path('London','Berlin',1100);

		testpath_cons.forEach(function(c) {
			module.path(c[0],c[1],c[2]);
		});

		chr.resolve();
	};

	iterate(f,1);

	appendDivText('extra links added:' +  testpath_cons.length);
    let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};


let pathN = {
	name:'pathN',
	code: wrapModule(pathVarCHRCode),
	testcode: wrapExpr(pathNTestCode)
};



let minTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr);

    let arr = [];
    let n = 1000;
    let min = -100;
    let max = 100;
	for (let i = 0; i < n; i++) {
		let r = between(min,max);
		arr.push(r);
	}

	let f = _ => { 
		chr.reset();
		arr.forEach(n => {
			init.module.min(n);
		});

		init.module.findMin();
		chr.resolve();
	};

	iterate(f,10);

    appendDivText('set#:' + n);
    appendDivText('min:' + min);
    appendDivText('max:' + max);

	let vs = chr.Store.getItems().sort().map(c => c.show());
    vs.forEach(appendDivText);

    let cs = chr.Store.getItems();

	let modMinName = init.modname + '.min';
	let foundmins = cs.filter(c => c.name === modMinName).map(c => Var.get(c.args[0]));

    appendDivText('constraints:');
    appendDivText('foundmins:' + foundmins);
    appendDivText('constraint#:' + cs.length);

	let minarray = function(arr) { return arr.reduceRight(function(a,b) { return a < b ? a : b; }); }

	let cmin = minarray(arr);
	let calcmins = arr.filter(function(n) { return n === cmin; });

	appendDivText('calculated mins:' + calcmins);

	if (!eqArray(foundmins,calcmins))
		appendDivText('Error');
	else 
		appendDivText('OK');

}

let minCHRCode = function() {
		findMin, min(Min1) / min(Min2) | Min1 < Min2;

};

let min = {
	name:'min',
	code: wrapModule(minCHRCode,'minmin'),
	testcode: wrapExpr(minTestCode)
}


let fibTestCode = function() {

    let chr = new CHR();
    let init = Test.init(chr);

	let u = 100;
	let module = init.module;

    let f = _ => { 
    	    chr.reset();
    		module.upto(u);
    		chr.resolve(); 
    	};


	iterate(f,100);

    appendDivText('');
    appendDivText('constraints:');
	let vs = chr.Store.getItems().map(c => c.show());
    vs.forEach(appendDivText);

}

let fibCHRCode = function() {
	upto(_N) >>> fib(0,0), fib(1,1);
	upto(Max), fib(N,M) / fib(Nr,Mr) | 
		(N == Nr + 1, Nr < Max) >>>
			fib(N + 1,M + Mr);
};


let fib = {
	name:'fib',
	code: wrapModule(fibCHRCode,'fib'),
	testcode: wrapExpr(fibTestCode)

};

let xorTestCode = function() {
	let chr = new CHR();
	let init = Test.init(chr);

    let arr = [];
    let n = 100;
	for (let i = 0; i < n; i++) {
		let r = between(0,2);
		arr.push(r);
	}

	let f = _ => { 
		chr.reset();
		arr.forEach(n => {
			init.module.xor(n);
		});

		chr.resolve();
	};

	iterate(f,100);

    appendDivText('set#:' + n);

	let modXorName = init.modname + '.xor';
	let cs = chr.Store.getItems();
	let foundxors = cs.filter(c => c.name === modXorName).map(c => c.args[0].valueOf());


    appendDivText('constraints:');
    appendDivText('result xor:' + foundxors);
    appendDivText('constraint#:' + cs.length);

	let calcxor = arr.reduce((acc,val) => acc ^ val);
	appendDivText('calculated xors:', calcxor);

	if (!eqArray(foundxors,[calcxor]))
		appendDivText('Error');
	else 
		appendDivText('OK');

}

let xorCHRCode = function() {
	- xor(X) - xor(X) >>> xor(0);
	// [] / xor(X), xor(X) >>> xor(0);
	xor(1) - xor(0);
};


let xor = {
	name:'xor',
	code: wrapModule(xorCHRCode,'xor'),
	testcode: wrapExpr(xorTestCode)
};


let hammingTestCode = function() {
	let chr = new CHR();
	let init = Test.init(chr);

	let n = 50;

	let f = _ => { 
		chr.reset();
    	init.module.example(n);
		chr.resolve();
	};

	iterate(f,1);

    let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};


let hammingCHRCode = function() {
		- succ(A,A);
		succ(A,B) - succ(A,C) | (A < B, B <= C) >>> succ(B,C);

		uptoh(N), succ(S,X) / hamming(S) | (X < N) >>>  
			succ(X,2*X), succ(X,3*X), succ(X,5*X), hamming(X);

	  	- example(N) >>> succ(0,1), hamming(0), uptoh(N);
}

let hamming = 	{
	name:'hamming',
	code: wrapModule(hammingCHRCode,'hamming'),
	testcode: wrapExpr(hammingTestCode)
};


let gcdTestCode = function() {
	let chr = new CHR();
	let init = Test.init(chr);

	let n = 50;

	let vs = [17*5,17*13,29*17];

	let f = _ => { 
		chr.reset();
		vs.forEach(v => { init.module.gcd(v) });
		chr.resolve();
	};

	iterate(f,100);

	let gcd = chr.Store.getItems()[0].args[0];

	let p = vs.pop();
	appendDivText('the gcd of ' + vs + ' and ' + p + ' is ' + gcd);

    let cs = chr.Store.getItems();
    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};

let gcdCHRCode = function() {
	- gcd(0);
	gcd(N) / gcd(M) | (0 < N, N <= M) >>> gcd(M-N);
		// gcd(N) / gcd(M) | (0 < N, N <= M) >>> (N1 = M-N), gcd(N1);
}

let gcd = {
	name:'gcd',
	code: wrapModule(gcdCHRCode,'gcd'),
	testcode: wrapExpr(gcdTestCode)
};



let primesTestCode = function() {
	let chr = new CHR();
	let init = Test.init(chr);

	let n = 1000;

	let f = _ => { 
		chr.reset();
		init.module.uptoP(n);
		chr.resolve();
	};

	iterate(f,10);

	let ps = chr.Store.getItems();
	let primes = ps.map(p => p.args[0]);
	appendDivText('primes upto ' + n + ' are:');
	showArray('primes',primes);
};

let primesCHRCode = function() {
	- uptoP(N) | (N > 1) >>> uptoP(N-1), prime(N);
	prime(I) - prime(J) | 0 === J % I;
}

let primes = 	{
	name:'primes',
	code: wrapModule(primesCHRCode,'primes'),
	testcode: wrapExpr(primesTestCode)
};



let sqrtTestCode = function() {
    let chr = new CHR();
    let modname = 'Sqrt';
    let init = Test.init(chr,{},modname);

	let n=1000;
	let p=0.001;

	let f = _ => { 
		chr.reset();
		init.module.sqrt(n,1,p);
		chr.resolve();
	};

	iterate(f,1000);

	let sqrtCons = chr.Store.getItems(modname + '.sqrt/3');
	let sqrt = sqrtCons.map(c => c.args[1]);

	let sqrtJS = Math.sqrt(n);

	appendDivText(modname + '.sqrt of :' + n + ' is ' + sqrt, true);
	appendDivText('Math.sqrt of :' + n + ' is ' + Math.sqrt(n));
	appendDivText('precision:' + p);

	appendDivText('Math.sqrt:' + sqrtJS);
	appendDivText('Requested diff.:' + p + ' Obtained diff.: ' + (sqrt - sqrtJS));

};

let sqrtCHRCode = function() {
	// - sqrt(X,G) | (Math.abs(((G * G) / X) - 1) > 0.001) >>> sqrt(X,(G+ X / G) / 2)
	- sqrt(X,G,P) | (Math.abs(((G * G) / X) - 1) > P) >>> sqrt(X,(G + X / G) / 2, P);
};

let sqrt = 	{
	name:'sqrt',
	code: wrapModule(sqrtCHRCode),
	testcode: wrapExpr(sqrtTestCode)
};



let mergeTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'Merge');

    // let l = [6,2,3,9,20,52,1,5,23,3,2,6,45];
    let l = randomN(100,0,500);

	let f = _ => { 
		chr.reset();
		l.map(function(n) { init.module.merge(0,n); });
		chr.resolve();
	};

	iterate(f,10);

	var items = chr.Store.getItems();
	var ms = items.map(i => [i.args[0],i.args[1]]);

	function sortNumber([a1,b1],[a2,b2]) {
	    let a = a1 - a2;
	    return (a === 0) ? b1 = b2 : a;
	}

	let mss = ms.sort(sortNumber);

    appendDivText('constraint#:' + items.length);

    showArray('merged',mss);

};

let mergeCHRCode = function() {
	merge(A,B) / merge(A,C) | A < B && B < C >>> merge(B,C);
}

let merge = {
	name:'merge',
	code: wrapModule(mergeCHRCode),
	testcode: wrapExpr(mergeTestCode)
};


let combTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'Comb');

	let set = [];

	function gen(n) {
		for (let i = 0; i < n; i++) {
			let s = between(1,5);
			let e = between(s+1,6);
			set.push(['c'+i,s,e]);
		}
	}

	function simple() {
		set = [['a',1,2],['b',2,3],['c',3,4],['d',1,2],['e',2,3]];
	}

	// simple();
	gen(100);

	let f = _ => { 
		chr.reset();
		set.forEach(function(vs,i) {
			init.module.comb.apply(null,vs); 
		});
		chr.resolve();
	};

	iterate(f,1);

    appendDivText('constraint#:' + chr.Store.getItems().length);

    showArray('set',set);

	let combs = chr.Store.getItems(init.modname + '.comb/' + 3);
	appendDivText('combs#:' + combs.length);

	let triples = chr.Store.getItems(init.modname + '.triple/' + 3).map(c => c.args);
	showArray('combinations',triples);

}

let combCHRCode = function() {
	comb(N1,A,B), comb(N2,B,C), comb(N3,C,D) >>> triple(N1,N2,N3);
}

let comb = {
	name:'comb',
	code: wrapModule(combCHRCode),
	testcode: wrapExpr(combTestCode)

};

let parserTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'Parser');

	let string = '((a,b,c),b,[c,d],f),';
	let tokens = string.split('');


	let n = 500;
	let l = tokens;

	while (l.length < n) {
		l = l.concat(tokens);
	}

	l.push('end');


	let module = init.module;
	let f = _ => { 
		chr.reset();
		// terminals
		module.r('popen','(');
		module.r('pclose',')');
		module.r('bopen','[');
		module.r('bclose',']');

		module.r('comma',',');

		module.r('word','a');
		module.r('word','b');
		module.r('word','c');
		module.r('word','d');
		module.r('word','e');
		module.r('word','f');
		module.r('word','g');

		module.r('listcomma','word','comma');

		module.r('listelem','listcomma','word');
		module.r('listcomma','listelem','comma');

		module.r('listpopen','popen','listelem');
		module.r('list','listpopen','pclose');

		module.r('arraypopen','bopen','listelem');
		module.r('array','arraypopen','bclose');

		l.forEach(function(t,i) {
			module.e(t,i,i+1);
		});

		chr.resolve();
	};

	iterate(f,1);

    appendDivText('tokens:' + n,true);
    appendDivText('constraint#:' + chr.Store.getItems().length);
    appendDivText('list#:' + l.join(''));

    if (l.length < 100)
    	showArray('set',l);

	let listelems = chr.Store.getItems(init.modname+'.p/4').filter(c => c.args[0] === 'listelem').map(c => ({from:c.args[1], to:c.args[2], listelem: l.slice(c.args[1],c.args[2]).join('') }));
	showArray('listelems',listelems);


	let lists = chr.Store.getItems(init.modname+'.p/4').filter(c => c.args[0] === 'list').map(c => ({from:c.args[1], to:c.args[2], list: l.slice(c.args[1],c.args[2]).join('') }));
	showArray('lists',lists);

	let arrays = chr.Store.getItems(init.modname+'.p/4').filter(c => c.args[0] === 'array').map(c => ({from:c.args[1], to:c.args[2], array: l.slice(c.args[1],c.args[2]).join('') }));
	showArray('arrays',arrays);
}

let parserCHRCode = function() {
		p(A,I,J,P1) / p(A,I,J,P2); 
		p(A,I,J,P), eq(A,B) >>> p(B,I,J,P); 
		p('list',I,J,P1) / p(_,I2,J2,P2) | (I <= I2, J >= J2); 
		r(A,T), e(T,I,J) >>> p(A,I,J,{t:T});
		r(A,B,C), p(B,I,J,P1), p(C,J,K,P2) >>> p(A,I,K,{nt:{fst:B,snd:C},bp:J});
};

let parser = {
	name:'parser',
	code: wrapModule(parserCHRCode),
	testcode: wrapExpr(parserTestCode)

};



let parserDirectTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'ParserDirect');

	let string = '((a,b,c),b,[c,d],f),';
	let tokens = string.split('');


	let n = 5000;
	let l = tokens;

	while (l.length < n) {
		l = l.concat(tokens);
	}

	l.push('end');


	// console.timeEnd('testparserexpl');
	// console.log(tokens.map((t,i) => '' + t + ':' + i))

	let module = init.module;

	let f = _ => { 
		chr.reset();
		l.forEach(function(t,i) {
			// console.log('add',t,i,i+1);
			if (t === ',')
				module.pd('comma',i,i+1)
			else if (t === '(')
				module.pd('popen',i,i+1)
			else if (t === ')')
				module.pd('pclose',i,i+1)
			else if (t === '[')
				module.pd('bopen',i,i+1)
			else if (t === ']')
				module.pd('bclose',i,i+1)
			else 
				module.pd('word',i,i+1,t+i);
		});
		chr.resolve();
	};

	iterate(f,1);

    appendDivText('tokens:' + n,true);
    appendDivText('constraint#:' + chr.Store.getItems().length);

    if (l.length < 100)
    	showArray('list',l);

	let array = chr.Store.getItems(init.modname + '.pd/' + 4).filter(c => c.args[0] === 'array').map(c => ({from:c.args[1], to:c.args[2], array: l.slice(c.args[1],c.args[2]).join('') }));
	showArray('arrays',array);

	let list = chr.Store.getItems(init.modname + '.pd/' + 4).filter(c => c.args[0] === 'list').map(c => ({from:c.args[1], to:c.args[2], list: l.slice(c.args[1],c.args[2]).join('') }));
	showArray('list',list);
}

let parserDirectCHRCode = function() {
		pd(A,I,J,P1) / pd(A,I,J,P2); 
		[] / pd('popen',A,B), pd('listelem',B,C,L), pd('pclose',C,D) >>> pd('list',A,D,{arglist:L});
		[] / pd('bopen',A,B), pd('listelem',B,C,L), pd('bclose',C,D) >>> pd('array',A,D,{array:L});

		[] / pd('word',A,B,W) >>> pd('listelem',A,B,{list:W});
		pd('list',A,B,L) >>> pd('listelem',A,B,{list:L});
		pd('array',A,B,Arr) >>> pd('listelem',A,B,{list:Arr});

		[] / pd('listelem',A,B,E), pd('comma',B,C) >>> pd('listcomma',A,C,E);

		[] / pd('listcomma',A,B,{list:L}), pd('listelem',B,C,{list:W}) >>> pd('listelem',A,C,{list:[].concat(L,W)});

		// pd('list',A,B,{list:L}), pd('list',B,C,{list:L2}) >>> pd('list',A,C,{list:[].concat(L,L2)});
};

let parserdirect = {
	name:'parserDirect',
	code: wrapModule(parserDirectCHRCode),
	testcode: wrapExpr(parserDirectTestCode)

};



let parserExplTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'ParserExpl');

	let string = '((a,b,c),b,[c,d],f),';
	let tokens = string.split('');


	let n = 10000;
	let l = tokens;

	while (l.length < n) {
		l = l.concat(tokens);
	}

	l.push('end');


	// console.timeEnd('testparserexpl');
	// console.log(tokens.map((t,i) => '' + t + ':' + i))


	let f = _ => { 
		chr.reset();
		l.forEach(function(t,i) {
			// console.log('add',t,i,i+1);
			if (t === ',')
				init.module.comma(i,i+1);
			else if (t === '(')
				init.module.popen(i,i+1);
			else if (t === ')')
				init.module.pclose(i,i+1);
			else if (t === '[')
				init.module.bopen(i,i+1);
			else if (t === ']')
				init.module.bclose(i,i+1);
			else 
				init.module.word(i,i+1,t+i);
		});
		chr.resolve();
	};

	iterate(f,1);

    appendDivText('tokens:' + n,true);
    appendDivText('constraint#:' + chr.Store.getItems().length);

    if (l.length < 100)
    	showArray('set',l);

	let array = chr.Store.getItems(init.modname + '.array/' + 3).map(c => ({from:c.args[0], to:c.args[1], array: l.slice(c.args[0],c.args[1]).join('') }));
	showArray('arrays',array);

	let list = chr.Store.getItems(init.modname + '.list/' + 3).map(c => ({from:c.args[0], to:c.args[1], list: l.slice(c.args[0],c.args[1]).join('') }));
	showArray('list',list);
}

let parserExplCHRCode = function() {
		[] / popen(A,B), listelem(B,C,L), pclose(C,D) >>> list(A,D,{list:L});
		[] / bopen(A,B), listelem(B,C,L), bclose(C,D) >>> array(A,D,{array:L});

		[] / word(A,B,W) >>> listelem(A,B,{list:W});
		list(A,B,L) >>> listelem(A,B,{list:L});
		array(A,B,Arr) >>> listelem(A,B,{list:Arr});

		[] / listelem(A,B,E), comma(B,C) >>> listcomma(A,C,E);

		[] / listcomma(A,B,{list:L}), listelem(B,C,{list:W}) >>> listelem(A,C,{list:[].concat(L,W)});
};

let parserexpl = {
	name:'parserexpl',
	code: wrapModule(parserExplCHRCode),
	testcode: wrapExpr(parserExplTestCode)

};



let selectTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'Select');

	let n = 1000;

	let l = [];

	for (let i = 0; i < n; i++) {
		let offset = Utils.between(0,25);
		l.push(String.fromCharCode(97+offset));
	}

	let f = _ => { 
		chr.reset();

		l.forEach(function(t,i) {
			init.module.select(t,i);
		});
		chr.resolve();
	};

	iterate(f,10);

    appendDivText('selections:' + n,true);
    // appendDivText('constraint#:' + chr.Store.getItems().length);

	let found = chr.Store.getItems('Select.found/2');

	appendDivText('found cs:' + found.length);

	let kvs = found.map(c => ({k:c.args[0],v:c.args[1] }) );
	let arr = [];
	kvs.forEach(kv => {
		arr[kv.v] = kv.k;
	});

	if (!eqArray(l,arr))
		appendDivText('Error');
	else 
		appendDivText('OK');

}

let selectCHRCode = function() {
		select('a',N) >>> found('a',N);  	
		select('b',N) >>> found('b',N);  	
		select('c',N) >>> found('c',N);  	
		select('d',N) >>> found('d',N);  	
		select('e',N) >>> found('e',N);  	
		select('f',N) >>> found('f',N);  	
		select('g',N) >>> found('g',N);  	
		select('h',N) >>> found('h',N);  	
		select('i',N) >>> found('i',N);  	
		select('j',N) >>> found('j',N);  	
		select('k',N) >>> found('k',N);  	
		select('l',N) >>> found('l',N);  	
		select('m',N) >>> found('m',N);  	
		select('n',N) >>> found('n',N);  	
		select('o',N) >>> found('o',N);  	
		select('p',N) >>> found('p',N);  	
		select('q',N) >>> found('q',N);  	
		select('r',N) >>> found('r',N);  	
		select('s',N) >>> found('s',N);  	
		select('t',N) >>> found('t',N);  	
		select('u',N) >>> found('u',N);  	
		select('v',N) >>> found('v',N);  	
		select('w',N) >>> found('w',N);  	
		select('x',N) >>> found('x',N);  	
		select('y',N) >>> found('y',N);  	
		select('z',N) >>> found('',N);  	
};

let select = {
	name:'select',
	code: wrapModule(selectCHRCode),
	testcode: wrapExpr(selectTestCode)

};



let testTestCode = function() {
    let chr = new CHR();
    let init = Test.init(chr,{},'Test');

	init.module.addsel();
	chr.resolve();

	let cs = chr.Store.getItems();
	appendDivText('cs:' + cs.length);

}


let testCHRCode = function() {
  		let handler;
  		let sto = setTimeout;
  		let sel = document.getElementById('codeselect');
  		let appendOpt = function(sel,n,v) {
            var opt = document.createElement("option");
            opt.text = n;
            opt.value = v;
            sel.add(opt);
  		};
  		test >>> (handler = chr.onRemove(modname + 'test2/0', function() { console.log('removing test2') }));
  		-test2 >>> console.log('test2'), chr.removeHandler(handler);

  		addsel >>> sto(function() { appendOpt(sel,'aaa', 'bbb'); }, 5000);
  };


let test = {
	name:'test',
	code: wrapModule(testCHRCode),
	testcode: wrapExpr(testTestCode)
};


let playgroundTestCode = function() {
    let chr = new CHR();
    let init = Playground.init(chr,{},'Playground');

	let testinput = [path,pathVar,pathN,min,fib,xor,hamming,gcd,primes,sqrt,merge,comb,parser,parserdirect,parserexpl,select,test,playground];
	
	init.module.init(testinput);
	chr.resolve();
};

let playgroundCHRCode = CHR.Modules.Playground.playground;


let playground = {
	name:'playground',
	code: wrapModule(playgroundCHRCode,undefined,'Playground'),
	testcode: wrapExpr(playgroundTestCode)
}



let compilerPanelTestCode = function() {
    let chr = new CHR();
    let init = CompilerPanel.init(chr,{},'CompilerPanel');

	init.module.init();
	chr.resolve();
};

let compilerPanelCHRCode = CHR.Modules.CompilerPanel.compilerPanel;


let compilerPanel = {
	name:'compilerPanel',
	code: wrapModule(compilerPanelCHRCode,undefined,'CompilerPanel'),
	testcode: wrapExpr(compilerPanelTestCode)
}



let nTestCode = function() {
    let chr = new CHR();
    let init = N.init(chr,{},'N');

	init.resolve.test();
};

let nCHRCode = function() {
    appendText(t) >>>  (
        d = document.createElement('div'),
        d.appendChild(document.createTextNode(t)),
        output = document.getElementById('outputContainer'),
        output.appendChild(d)
    );
    
	test >>> test(null,6);
	- test >>> test(undefined,7);

	test(null,N) >>> appendText('works null:'+N);
	test(undefined,N) >>> appendText('works undefined:'+N);
	test(a,N) | (a === null || a === undefined) >>> appendText('works both:' + N);
    test(a,N) >>> appendText('works both 2:' + N);
};


let nullUndefined = {
	name:'null-undefined',
	code: wrapModule(nCHRCode,undefined,'N'),
	testcode: wrapExpr(nTestCode)
}


let timepointTestCode = function() {
    let chr = new CHR();
    let init = Timepoint.init(chr,{},'Timepoint');

	let f = _ => { 
		chr.reset();
    	init.module.example();
		chr.resolve();
	};

	try {
		iterate(f,1);
	}
    catch (e) {
		appendDivText('error:' + e);
    } 

	let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};

let timepointCHRCode = function() {
    
    let fail = function(mess) { throw new Error(mess); };

	- start(X)  >>> pos(0,X,0);

	- pos(A,X,B) | A > B >>> fail('Inconsistent timepoint: ' + X + ' (' + A + ' > ' + B + ')');

	// [] / pos(A,Y,B), pos(C,Y,D) >>> pos(Math.max(A,C),Y,Math.min(B,D));

	pos(A,Y,B) / pos(C,Y,D) |  A === Math.max(A,C) && B === Math.min(B,D);
	pos(A,Y,B), pos(C,Y,D) >>>  pos(Math.max(A,C),Y,Math.min(B,D));

	- dist(A,X,Y,B), - dist(C,X,Y,D) >>> dist(Math.max(A,C),X,Y,Math.min(B,D));

	pos(A,Y,B), dist(C,Y,Z,D) >>> pos(A+C,Z,B+D);
	pos(A,Y,B), dist(C,Z,Y,D) >>> pos(A-D,Z,B-C);

	- example >>> start('x'), dist(3,'x','y',10), dist(4,'y','z',5);
	- example2 >>> start('A'), dist(4,'A','B',7), dist(1,'B','C',4), pos(10,'C',13);
	- example2var >>> start(A), dist(4,A,B,7), dist(1,B,C,4), pos(10,C,13);
	- example3fail >>> start('A'), dist(4,'A','B',7), dist(1,'B','C',2), pos(10,'C',13);
	- example4 >>> start('A'), dist(14.3,'A','B',17.5), dist(14.3,'A','B',16.3), dist(12.2,'B','C',14.5);
};


let timepoint = {
	name:'timepoint',
	code: wrapModule(timepointCHRCode,undefined,'Timepoint'),
	testcode: wrapExpr(timepointTestCode)
}

let queensTestCode = function() {
    let chr = new CHR();
    let init = Queens.init(chr,{},'Queens');

	let f = _ => { 
		chr.reset();
    	init.resolve.example();
	};

	try {
		iterate(f,1);
	}
    catch (e) {
		appendDivText('error:' + e);
    } 

	let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};

let queensCHRCode = function() {

	solve(n), - q(n,_) >>> found(n-1), next(n-1); // solution
	solve(sn), - q(n,p) | p >= sn >>> back(n-1); // not found
	solve(n) >>> check(0,0);

	- back(-1); // console.log('no more solutions');
	- back(n) >>> next(n);

	- next(n), - q(n,p) >>> remove(n,p), check(n,p+1); 
    
	remove(n,p), - col(p);
	remove(n,p), - ld(n,_);
	remove(n,p), - rd(n,_);
	- remove(n,p);

	- check(n,p), col(p) >>>  check(n,p+1);
	- check(n,p), ld(_,l) | l === (p-n) >>>  check(n,p+1);
	- check(n,p), rd(_,r) | r === (p+n) >>>  check(n,p+1);
	- check(n,p) >>> q(n,p);

	q(n,p) >>> col(p),ld(n,p-n),rd(n,p+n), check(n+1,0);

	- found(n) >>> (cs = chr.getConstraints(modname + '.q/2').map(c => c.args[1])), solution(cs);

	- example >>> solve(8);
};


let queens = {
	name:'queens',
	code: wrapModule(queensCHRCode,undefined,'Queens'),
	testcode: wrapExpr(queensTestCode)
}


let queens2TestCode = function() {
    let chr = new CHR();
    let init = Queens2.init(chr,{},'Queens2');

	let f = _ => { 
		chr.reset();
    	init.module.example();
		chr.resolve();
	};

	try {
		iterate(f,1);
	}
    catch (e) {
		appendDivText('error:' + e);
    } 

	let cs = chr.Store.getItems();

    appendDivText('constraints:');
    cs.sort().forEach(c => appendDivText(c.show()));
    appendDivText('constraint#:' + cs.length);

};

let queens2CHRCode = function() {
    
// // solve(N): solve N-queens problem
// solve(N)            <=> queens(N,[],_), labelq.

// // queens(N,L,D): for each M in 1..N create 'q(M) in D' (domain D generated)
// queens(N,L,D)        <=> N>0 | N1 is N-1, q(N) in D, queens(N1,[N|L],D).
// queens(0,L,D)        <=> L=D.

// // q(N) in P: queen in column N may sit in rows P
// // reduce possible positions of queens; fail if no position remains
// q(N1) in [P] \ q(N2) in D <=> P1 is P-(N1-N2), P2 is P+(N1-N2), 
//         delete(D,P,D1), delete(D1,P1,D2), delete(D2,P2,D3), D\==D3 |
//         D3\==[], q(N2) in D3.

// // next 3 rules are VARIANT to last rule
// // // q(N)in[P] \ q(N1)in D <=> select(P,D,D1) | D1\==[], q(N1) in D1.
// // // q(N)in[P] \ q(N1)in D <=> P1 is P-(N-N1),select(P1,D,D1)| D1\==[],q(N1)in D1.
// // // q(N)in[P] \ q(N1)in D <=> P1 is P+(N-N1),select(P1,D,D1)| D1\==[],q(N1)in D1.

// // label queens: select one of several queen positions
// labelq \ q(N) in D  <=> D=[_,_|_] | member(P,D), q(N) in [P].

	- example >>> solveall(8,N,S);
};


let queens2 = {
	name:'queens2',
	code: wrapModule(queens2CHRCode,undefined,'Queens'),
	testcode: wrapExpr(queens2TestCode)
}


let testinput = [path,pathVar,pathN,min,fib,xor,hamming,gcd,primes,sqrt,merge,comb,parser,parserdirect,parserexpl,select,test,playground,compilerPanel,nullUndefined,timepoint,queens];







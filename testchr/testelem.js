

CHR.Modules.Queens = {

	version: '0.0.1',

	queensCHRCode: function() {
	    
	solve(n), - q(n,_) >>> found(n-1), next(n-1); // solution
	solve(sn), - q(n,p) | p >= sn >>> back(n-1); // not found
	solve(n) >>> check(0,0);

	- back(-1) >>> console.log('no more solutions');
	- back(n), - q(n,p)>>> remove(n,p), check(n,p+1); 

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

		// - example >>> test(8);
	}

};



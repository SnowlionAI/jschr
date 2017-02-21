

CHR.Modules.Playground = {

	version: '0.0.1',

	playground: function() {

		// let Constraint = require('/constraint.js');
		
		- addScript(js) >>> (
			toDataURI('text/javascript',js,du),
			script = document.createElement('script'),
			script.setAttribute('src', du),
			document.body.appendChild(script)
		);

		- toDataURI(mime,obj,res) >>> (
			encoded = btoa(obj),
			res = "data:" + mime + ";base64," + encoded    
		);


		- onhoverText(n,ht) | n.constructor === String >>> (e = document.getElementById(n), onhoverText(e,ht));
		- onhoverText(e,ht) >>> (
			prev = undefined,
    		e.onmouseenter = () => { prev = e.innerText; e.innerText = ht; },
    		e.onmouseleave = () => { (e.innerText == ht) && (e.innerText = prev); }
		);


		- removeChildren(p) | p.constructor === String >>> (o = document.getElementById(p), removeChildren(o));
		- removeChildren(p) | p.hasChildNodes() >>> (p.removeChild(p.lastChild), removeChildren(p));
		- removeChildren(_);

		- removeOptions(p) | p.constructor === String >>> (o = document.getElementById(p), removeOptions(o));
		- removeOptions(p) | (p.length > 0) >>> (p[0].remove(), removeOptions(p));
		- removeOptions(_);


		- getText(n,t) | n.constructor === String >>> (r = document.getElementById(n), getText(r,t));
		- getText(e,t) >>> (t = e.innerText);

		- setText(n,t) | n.constructor === String >>> (r = document.getElementById(n), setText(r,t));
		- setText(e,t) >>> (e.innerText = t);

		compile, - compiled(_);
	    - compile, editor('editor',e) >>> (
	    	js = e.getValue(),
	    	jsOut = Compiler.parseCompileGenerate(js),
	    	compiled(jsOut)
	    );

	    compiled(jsOut) >>> 
	    	setText('compile','Compiled'),
	    	setDisabled('inject',false),
	    	setEditorValue('editorOut',jsOut),
	    	clearSelection('editorOut');

	    - inject, editor('editorOut',e) >>> 
	        (js = e.getValue()),
	        addScript(js),
	        setText('inject','Injected'),
	        setDisabled('exec',false);

	    - exec, editor('editorExec',e) >>> 
	    	(js = e.getValue()),
	        addScript(js),
	        setText('exec','Executed'),
	        setDisplay('outputblock'),
	        setDisabled('clearOutput',false);

	    - clear >>>
	    	removeChildren('outputContainer'),
	        setDisabled('clearOutput'),
	        setText('outputContainer',''),
	        setText('exec','Execute');

	    // let sel = document.getElementById('codeselect');

		- onclick(n,f) | n.constructor === String >>> (e = document.getElementById(n), onclick(e,f));
		- onclick(e,f) >>> (e.onclick = f);

		let sel = document.getElementById('codeselect');

		playground(name,code1,testcode1), - playground(name,code2,testcode2);
		playground(name,code,testcode) >>> (
			console.log(name),
			opt = document.createElement("option"),
	  		opt.selected = false,
	        opt.text = name,
	        opt.value = name,
	        sel.add(opt)
		);



		- setDisabled(id) >>> setDisabled(id,true);
		- setDisabled(id,state) >>> (
    		e = document.getElementById(id),
    		e.disabled = state
		);

		- setDisplay(id) >>> setDisplay(id,true);
		- setDisplay(id,state) >>> (
    		e = document.getElementById(id),
    		e.style.display = (state ? 'block' : 'none')
		);


		- select(i) | i.constructor === Number && i < 0 >>> select(sel.length + i);
		- select(i) | i.constructor === Number && i >= 0 && i < sel.length >>> select(sel[i].value);
		- select(name), playground(name,code,testcode) >>>
			console.log(name),
			setEditorValue('editor',code),
			clearSelection('editor'),

			setEditorValue('editorOut',''),
			clearSelection('editorOut'),

			setEditorValue('editorExec',testcode),
			clearSelection('editorExec'),

			setDisabled('inject',true),
			setDisabled('exec'),
			setDisabled('clearOutput');

		- timestamp(t) >>> (t = performance.now());
		- time >>> timestamp(t), console.log(t);

		- setEditorValue(elem,v), editor(elem,e) >>> e.setValue(v);

		- clearSelection(elem), editor(elem,e) >>> e.clearSelection();

		- initEditor(id) >>>
			(e = ace.edit(id)), 
	    	e.setTheme("ace/theme/monokai"),
	    	e.getSession().setMode("ace/mode/javascript"),
			editor(id,e);

		- onEditorChange(id,f), editor(id,e) >>> e.getSession().on('change',f);

		let expand = function(self,ebs) {
		    let exp = self.expanded;
		    ebs.forEach(e => {
		        e.parentNode.parentNode.style.flexBasis = "20%"
		        e.expanded = false;
		        e.className = replaceAll(e.className, 'fa-minus', 'fa-plus');
		    });
		    if (exp !== true) {
		        self.parentNode.parentNode.style.flexBasis = "90%";
		        self.expanded = true;
		        self.className += ' fa-minus';
		    }
		};

		let replaceAll = function(str, search, replacement) {
		    return str.split(search).join(replacement);
		};

		let ensureForEach = function(ns) {
			if (ns.forEach)
				return ns;
			ns.forEach = function(f) {
				let n = ns.length;
				for (let i = 0; i < n; i++) {
					f(ns[i]);
				};
			} 
			return ns;
		};

		- editorEnlarge >>> (
			ebs = document.querySelectorAll('.editorEnlarge'),
			ebs = ensureForEach(ebs),
		    ebs.forEach(e => {
		        e.onclick = function() { expand(this,ebs) };
		    })
		);

		- init(codes) >>> 
			removeOptions('codeselect'),
			codes.forEach((c,i) => {
				resolve.playground(c.name,c.code,c.testcode);
			}),
			sel.onchange = function() { 
				resolve.select(this[this.selectedIndex].value);
			},

			// select(-1),
			select(0),

		    onclick('compile', () => { resolve.compile(); }),
		    onclick('inject', () => { resolve.inject(); }),
		    onclick('exec', () => { resolve.exec(); }),
		    onclick('clearOutput', () => { resolve.clear(); }),

		    onhoverText('compile','Compile'),
		    onhoverText('inject','Inject'),
		    onhoverText('exec','Execute'),

		    initEditor('editor'),
		    initEditor('editorOut'),
		    initEditor('editorExec'),

		    editorEnlarge,

			onEditorChange('editor', () => { module.setText('compile','Compile') }),
			onEditorChange('editorOut', () => { module.setText('inject','Inject') }),
			onEditorChange('editorExec', () => { module.setText('exec','Execute') }),

		    time;
    }

}



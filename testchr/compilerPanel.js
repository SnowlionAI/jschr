

CHR.Modules.CompilerPanel = {

	version: '0.0.1',

	compilerPanel: function() {

			let ddstyle = `
.drop {
    width: 300px;
    height: 100px;
    line-height: 100px;
    border: 5px dashed #CCC;
    
    font-family: Verdana;
    text-align: center;
}`;


		- addScript(js) >>> (
			toDataURI('text/javascript',js,du),
			script = document.createElement('script'),
			script.setAttribute('src', du),
			document.body.appendChild(script)
		);

		- addStyle(style) >>> (
			toDataURI('text/javascript',style,du),
			link = document.createElement('link'),
			link.setAttribute('href', du),
			link.setAttribute('rel','stylesheet'),
			document.body.appendChild(link)
		);

		- saveFile(name,obj) >>> (
		    filesOut = document.getElementById("filesOut"),
		    filesOut.style.display = "inline",
    		mkLink(name,obj,link),
		    filesOut.appendChild(link)
		);

		- mkLink(name,obj,link) >>> (
    		a = document.createElement('a'),
		    a.download = name,
    		a.target = '__blank',
    		toDataURI('text/javascript',obj,res),
    		a.href = res,
    		a.innerHTML = name,
    		a.style.display = 'block',
    		link = a
		);

		- toDataURI(mime,obj,res) >>> (
			encoded = btoa(obj),
			res = "data:" + mime + ";base64," + encoded    
		);

		let outputContainer = document.getElementById('outputContainer');

		- makeElem(elem,div) >>> (
			div = document.createElement(elem)
		);

		- makeDiv(div) >>> makeElem('div',div);
		- makeSpan(span) >>> makeElem('span',span);

		- makeDiv(id,clazz,div) >>> (
			makeDiv(div),
			Var.deref(div).setAttribute('id',id),
			div.deref().setAttribute('class',clazz)
		);

		- ondragover(e,f) >>> e.addEventListener("dragover", function(e) { resolve.prev(e,f,ret); return ret; });
		- ondragleave(e,f) >>> e.addEventListener("dragleave", function(e) { resolve.prev(e,f,ret); return ret; }); 
		- ondrop(e,f) >>> e.addEventListener("drop", function(e) { resolve.prev(e,f,ret); return ret; }); 

		- prev(e,f) >>> pref(e,f,v);
		- prev(e,f,ret) >>> (e.stopPropagation(), e.preventDefault(), f(e), ret = false);

		- getFiles(e,fs) >>> (fs = e.dataTransfer.files); 


		- pcgSave(name,js) >>> (
			jsOut = Compiler.parseCompileGenerate(js),
			saveFile(name,jsOut)
		);


		let nf = function() { return new FileReader(); };

		- fileReader(f,n,arr) >>> (
	        r = nf(),
	        r.onload = function(e) { resolve.pcgSave(f.name,e.target.result); },
	        r.readAsBinaryString(f)
		);

		- handleFiles(e) >>> (
			getFiles(e,fs),
			fss = Array.prototype.slice.apply(fs),
	        fss.forEach(
	        	resolve.fileReader.bind(undefined)
	        )
	        // fss.forEach(f => {
	        // 	resolve.fileReader(f)
	        // })
		);

		let drop = function(e) { 
	  		resolve.handleFiles(e);
	    };

		- init >>> (
			makeDiv('drop','drop',div),
			t = document.createTextNode('drop files to compile here...'),
			div.appendChild(t),
			outputContainer.appendChild(div),
			makeSpan(span),
			span.setAttribute('id','filesOut'),
			span.style.display = 'none',
			outputContainer.appendChild(span),

			addStyle(ddstyle),

			ondragover(div,function() { console.log('dragover...'); }),
			ondragleave(div,function() { console.log('dragleaving...'); }),

			ondrop(div,drop)

		);
    }

}



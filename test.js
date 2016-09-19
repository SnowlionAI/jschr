


var toB64 = btoa;
var fromB64 = atob;

function saveFile(name,obj) {
    // var b64 = toB64(obj);
    var filesOut = document.getElementById("filesOut");
    filesOut.style.display = "inline";

    var link = mkLink(name,obj);

    filesOut.appendChild(link);
}

function mkLink(name,obj) {

    var a = document.createElement('a');
    a.download = name;
    a.target = '__blank';
    a.href = toDataURI('text/javascript',obj);
    a.innerHTML = name;
    a.style.display = 'block';

    return a;
}

function addScript(js) {
    var du = toDataURI('text/javascript',js);
    var script = document.createElement('script');
    script.setAttribute( 'src', du );
    document.body.appendChild( script );
}

function toDataURI(mime,obj) {
    var encoded = btoa(obj);
    return "data:" + mime + ";base64," + encoded;    
}


function initPlayground() {
    let chr = new CHR();
    // console.log(chr);
    let init = Playground.init(chr,{},'Playground');

    init.module.init(testinput);
    chr.resolve();
}


function initCompilerPanel() {
    let chr = new CHR();
    init = CompilerPanel.init(chr,{},'CompilerPanel');

    init.module.init();
    chr.resolve();
}



window.onload = (function() { initPlayground(); initCompilerPanel(); });



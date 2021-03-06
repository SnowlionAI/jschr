


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
    let base = Playground.init(chr,'Playground');

    base.module.Playground.init(testinput);
    chr.resolve();
}


function initCompilerPanel() {
    let chr = new CHR();
    init = CompilerPanel.init(chr,'CompilerPanel');

    init.module.init();
    chr.resolve();
}


var Constraint = require('/constraint.js');

var chr;
var init;
function initTestElem() {
    chr = new CHR();
    init = Reactive.init(chr);

    let f = _ => { 
        chr.reset();
        init.resolve.Reactive.init();
    };

    iterate(f,1);

    appendDivText('resolutions:' + chr.res);

    let cs = chr.Store.getItems();

    // appendDivText('constraints:');
    // cs.sort().forEach(c => appendDivText(Constraint.show(c)));
    // appendDivText('constraint#:' + cs.length);
   
}

window.onload = (function() { initPlayground(); });



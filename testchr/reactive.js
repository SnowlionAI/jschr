CHR.Modules.Reactive = {

	version:'0.0.1',

  	reactive: function () {

        let outputContainer = document.getElementById('outputContainer');
        let codeselect = document.getElementById('codeselect');

        let eqArgs = function(n,c1,c2) { return Constraint.args(c1,0) === Constraint.args(c2,0); };

        let appendDivText = function(t,bold) {
            let d = document.createElement('div');
            if (bold)
                d.style.fontWeight = 'bold';
            d.appendChild(document.createTextNode(t));
            let output = document.getElementById('outputContainer');
            output.appendChild(d);
        };

        - stream(c) >>> chr.remove(Constraint.nameArity(c)), chr.call(c);

        - stream(c,rem) | Constraint.isConstraint(rem) >>>  chr.call(rem), chr.call(c);

        - stream(c,n) | n.constructor === Number >>> 
            chr.remove(Constraint.nameArity(c), eqArgs.bind(null,n,c)),
            chr.call(c);

        - stream(c,f) | f.constructor === Function >>> 
            chr.remove(Constraint.nameArity(c), f),
            chr.call(c);


        removeInput(id), - input(id,_,_);
        - removeInput(id);

        - input('mm',out,coords) >>> (out.innerHTML = JSON.stringify(coords));
        input(id,type,value) >>> appendDivText('id:' + id + ' type:' + type + ' value:' + JSON.stringify(value));

        input('inp',type,value), input('codeselect',_,value2) >>> 
            stream(input('inpcs','combi',{ inp:value, codeselect:value2.value }),removeInput('inpcs'));

        // - handleEvent(c) >>> stream(input(c.id,'notask',c.value),0);
        // - handleEvent(i,t,v) >>> stream(input(i,t,v),0);

        - handleEvent(c) >>> stream(input(c.id,'notask',c.value),removeInput(c.id));
        - handleEvent(i,t,v) >>> stream(input(i,t,v),removeInput(i));


        event(i,type) | i.id !== undefined >>> once(event(i,type,i.id));

        event(i,type,id) | i.constructor.name === 'HTMLInputElement' >>> (
            i.oninput = function(e) { resolve.handleEvent(CHR.makeConstraint(i)); }
        );

        event(i,type,id) | i.constructor.name === 'HTMLSelectElement' >>> (
            i.onchange = function(e) { resolve.handleEvent(id,type,{i:i.selectedIndex,value:i.value}); }
        );

        - handleMouseMove(e), mouseOutDiv(out) >>> stream(input('mm',out,{x:e.clientX,y:e.clientY,sx:e.screenX,sy:e.screenY}));


        mousemove(e,out) >>> mouseOutDiv(out), e.addEventListener('mousemove',function(e) { resolve.handleMouseMove(e); },false);


        - once(c) >>> chr.call(c), chr.remove(c);

        let body = document.querySelector('body');

        - init >>> (
            d = document.createElement('div'),
            i = document.createElement('input'),
            i.id = 'inp',
            i.type = 'number',
            d.appendChild(i),
            outputContainer.appendChild(d),

            // event(i,'test'),
            // event(codeselect,'test')
            once(event(i,'test')),
            once(event(codeselect,'test')),

            dm = document.createElement('div'),
            outputContainer.appendChild(dm),
            once(mousemove(body,dm))
        );
    } 
};

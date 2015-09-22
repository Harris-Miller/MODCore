var frag = document.createDocumentFragment();
var morphs = {}
var e0 = document.createElement('h2');
frag.appendChild(e0);
var e1 = document.createTextNode('{{first}} {{last}}');
e0.appendChild(e1);
var e2 = document.createTextNode('
');
frag.appendChild(e2);
var e3 = document.createElement('form');
e3.setAttribute('action', '');
frag.appendChild(e3);
var e4 = document.createTextNode('
  ');
e3.appendChild(e4);
var e5 = document.createElement('fieldset');
morphs['showing'] = [];
morphs['showing'].push([e5, 'attr', 'class']);
e5.setAttribute('class', 'info');
e3.appendChild(e5);
var e6 = document.createTextNode('
    ');
e5.appendChild(e6);
var e7 = document.createElement('input');
e7.setAttribute('type', 'text');
morphs['first'] = [];
morphs['first'].push([e7, 'attr', 'value']);
e7.setAttribute('value', '');
e7.setAttribute('name', 'first');
e5.appendChild(e7);
var e8 = document.createTextNode('
    ');
e5.appendChild(e8);
var e9 = document.createElement('br');
e5.appendChild(e9);
var e10 = document.createTextNode('
    ');
e5.appendChild(e10);
var e11 = document.createElement('input');
e11.setAttribute('type', 'text');
morphs['last'] = [];
morphs['last'].push([e11, 'attr', 'value']);
e11.setAttribute('value', '');
e11.setAttribute('name', 'last');
e5.appendChild(e11);
var e12 = document.createTextNode('
    ');
e5.appendChild(e12);
var e13 = document.createElement('br');
e5.appendChild(e13);
var e14 = document.createTextNode('
    ');
e5.appendChild(e14);
var e15 = document.createElement('input');
e15.setAttribute('type', 'text');
e15.setAttribute('value', '31');
e15.setAttribute('name', 'age');
e5.appendChild(e15);
var e16 = document.createTextNode('
  ');
e5.appendChild(e16);
var e17 = document.createTextNode('
');
e3.appendChild(e17);
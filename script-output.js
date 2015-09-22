var frag = document.createDocuemntFragment();
var e0 = document.createElement('form');
e0.setAttribute('action', '');
frag.appendChild(e0);
var e1 = document.createTextNode('
  ');
e0.appendChild(e1);
var e2 = document.createElement('fieldset');
e2.setAttribute('class', 'info {{showing}}');
e0.appendChild(e2);
var e3 = document.createTextNode('
    ');
e2.appendChild(e3);
var e4 = document.createElement('input');
e4.setAttribute('type', 'text');
e4.setAttribute('value', '{{first}}');
e4.setAttribute('name', 'first');
e2.appendChild(e4);
var e5 = document.createTextNode('
    ');
e2.appendChild(e5);
var e6 = document.createElement('br');
e2.appendChild(e6);
var e7 = document.createTextNode('
    ');
e2.appendChild(e7);
var e8 = document.createElement('input');
e8.setAttribute('type', 'text');
e8.setAttribute('value', '{{last}}');
e8.setAttribute('name', 'last');
e2.appendChild(e8);
var e9 = document.createTextNode('
    ');
e2.appendChild(e9);
var e10 = document.createElement('br');
e2.appendChild(e10);
var e11 = document.createTextNode('
    ');
e2.appendChild(e11);
var e12 = document.createElement('input');
e12.setAttribute('type', 'text');
e12.setAttribute('value', '31');
e12.setAttribute('name', 'age');
e2.appendChild(e12);
var e13 = document.createTextNode('
  ');
e2.appendChild(e13);
var e14 = document.createTextNode('
');
e0.appendChild(e14);
'use strict';

const HTML5Tokenizer = require('simple-html-tokenizer');
const fs = require('fs');

let hbs = fs.readFileSync('html-tokenizer-test-2.hbs', 'utf8');

// console.log(hbs);
// console.log('');

let tokens = HTML5Tokenizer.tokenize(hbs);

// console.log(tokens);
// console.log('');

let inputs = tokens.filter(tokens => tokens.type === 'StartTag' && (tokens.tagName === 'input' || tokens.tagName === 'fieldset'));

// console.log(inputs);
// console.log('');

// inputs.forEach(input => console.log(input.attributes));
// console.log('');


const stack = [];
const script = [];
const morphs = []; // this is just so we know if a key alread exists in the script' morph variable

/**
 * scrubs the tokens
 *
 * Sets all `tageName` toLower
 * Also sets all `selfClosing` to true for all tagNames that are but end in `>` instead of `/>`
 *
 * @method scrubTokens
 * @param tokens
 */
function scrubTokens(tokens) {
  const selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ];

  tokens.forEach(token => {
    token.tagName && (token.tagName = token.tagName.toLowerCase());

    if (!token.selfClosing && selfClosingTags.indexOf(token.tagName) !== -1) {
      token.selfClosing = true
    }
  })

}

function createScript(tokens) {
  var nodes = 0;

  script.push('var frag = document.createDocumentFragment();');
  script.push('var morphs = {}');

  var current = 'frag';

  tokens.forEach(token => {
    let type = token.type;
    let variable;

    if (type === 'Chars') {
      variable = 'e' + nodes++;
      let chars = token.chars;
      
      // TODO: figure out how to separate the chars by `{{value}}`
      // eg: "Hello there, {{first}} {{last}}. How are you!"
      // -> [
      //      ['string', 'Hello there, '],
      //      ['mustache', 'first'],
      //      ['string', ' '],
      //      ['mustache', 'last'],
      //      ['string', ' How are you!']
      //    ]
      //
      // this way we can look through the tuples, and get and output of this:
      //
      // var e1 = document.createTextNode('Hello there, ');
      // var frag.appendChild(e1);
      // var e2 = document.createTextNode('');
      // morphs['first'].push([e2, 'text']);
      // var frag.appendChild(e2);
      // var e3 = document.createTextNode(' ');
      // var frag.appendChild(e3);
      // var e4 = document.createTextNode('');
      // morphs['last'].push([e4, 'text']);
      // var frag.appendChild(e4);
      // var e5 = document.createTextNode('. How are you!');
      // var frag.appendChild(e5);
      //
      // by separating out the static and variable portions of text like this,
      // we'll never have to re-render the entire sentence, only the mustache parts

      // TODO: html encode token.chars !!!
      script.push(`var ${variable} = document.createTextNode('${token.chars}');`);
      script.push(`${current}.appendChild(${variable});`);

      return;
    }
    else if (type === 'StartTag') {
      variable = 'e' + nodes++;
      let attrs = token.attributes;

      script.push(`var ${variable} = document.createElement('${token.tagName}');`);
      // TODO: handle tagNames that are custom components

      // handle all attributes
      if (attrs && Array.isArray(attrs)) {
        attrs.forEach(attr => {
          let name = attr[0];
          let values = attr[1] // escape ALL the things
            .replace('\\', '\\\\')
            .replace('\'', '\\\'')
            .replace('\"', '\\\"');

          // TODO: figure out which keys are properties and which are attributes

          // safe to assume that values are space delimited
          values = values.split(/\s+/); // TOOD: move this to a variable

          let mustaches = [];
          values = values.filter(val => {
            let mustache = val.match(/^\{\{(.*?)\}\}$/); // TODO: move this to a variable
            if (mustache) {
              mustaches.push(mustache[1]);
            }
            return !mustache;
          });

          // now we push
          mustaches.forEach(mustache => {
            if (morphs.indexOf(mustache) === -1) {
              morphs.push(mustache);
              script.push(`morphs['${mustache}'] = [];`);
            }
            script.push(`morphs['${mustache}'].push([${variable}, 'attr', '${name}']);`); // TODO: 'attr' may be 'prop' depending on 'name'
          })
          
          // TODO: only wrap second argument of setAttribute in a string if it needs it
          // TODO: this may need to be a direct property set, depending on 'name'
          script.push(`${variable}.setAttribute('${name}', '${values.join(' ')}');`);
        });
      }

      // add to current
      script.push(`${current}.appendChild(${variable});`);

      // if not self-closing, set current to variable
      if (!token.selfClosing) {
        stack.push(current);
        current = variable;
      }

      return;
    }
    else if (type === 'EndTag') {
      // when we reach and end tag, pop the stack and set to current
      current = stack.pop();
    }

  });
}

scrubTokens(tokens);
createScript(tokens);

console.log(script);
// console.log(morphs);

fs.writeFileSync('script-output.js', script.join('\n'));


process.exit(0);

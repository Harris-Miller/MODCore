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

inputs.forEach(input => console.log(input.attributes));
console.log('');


const stack = [];
const script = [];
const morphs = [];

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

  script.push('var frag = document.createDocuemntFragment();');

  var current = 'frag';

  tokens.forEach(token => {
    let type = token.type;
    let variable;

    if (type === 'Chars') {
      variable = 'e' + nodes++;

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
          let value = attr[1].replace('\\', '\\\\'); // escape

          // TODO: figure out which keys are properties and which are attributes
          // TODO: handle {{foo}}
          // TODO: only wrap second argument of setAttribute in a string if it needs it
          script.push(`${variable}.setAttribute('${attr[0]}', '${attr[1]}');`);
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
      current = stack.pop();
    }

  });
}

scrubTokens(tokens);
createScript(tokens);

console.log(script);

fs.writeFileSync('script-output.js', script.join('\n'));


process.exit(0);

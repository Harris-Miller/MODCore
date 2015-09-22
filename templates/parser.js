
import HTML5Tokenizer from 'simple-html-tokenizer';

var variables = 0;
var texts = 0;

const tree = {};
const stack = [];
const morphs = [];

var current = null;

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
    token.tagName = token.tagName.toLowerCase();
    if (!token.selfClosing && selfClosingTags.includes(toke.tagName)) {
      token.selfClosing = true
    }
  })

}

function createMorphObject(elementAST) {

  return {};
}


function createTree(tokens) {

}
/* global HTML5Tokenizer */

import ModObject from '../core/mod-object';

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

/**
 *
 *
 * @class Compiler
 * @constructor
 * @param template {String} html/handlebars string template
 * @param delegate {Object} delegate object to perform actions on during parsing
 */
export default class Compiler extends ModObject {
  constructor(template, delegate) {
    super();

    this.template = template;
    this.delegate = new delegate();
    this.output = null;
  }

  compile() {
    this._tokenize();
    this._scrubTokens();
    this._parseTokens();

    this.output = {
      frag: this.delegate.frag,
      morphs: this.delegate.morphs
    };
  }

  _tokenize() {
    // TODO: need to find a way to avoid using a globally defined HTML5Tokenizer
    this.tokens = HTML5Tokenizer.tokenize(this.template);
  }

  _scrubTokens() {
    this.tokens.forEach(token => {
      token.tagName && (token.tagName = token.tagName.toLowerCase());

      if (!token.selfClosing && selfClosingTags.indexOf(token.tagName) !== -1) {
        token.selfClosing = true
      }
    });
  }

  _parseTokens() {
    this.tokens.forEach(token => {
      let type = token.type;

      switch(type) {
        case 'Chars':
          this.delegate.handleChars(token);
          break;
        case 'StartTag':
          this.delegate.handleStartTag(token);
          break;
        case 'EndTag':
          this.delegate.handleEndTag(token);
          break;
        default:
          throw new Error('WHOA! unsupported token type!');
          break;
      }
    });
  }
}

// TODO: not needed here
function escapeChars(str) {
  const rSingleQuote = /\'/g;
  const rDoubleQuote = /\"/g;
  const rNewline = /\n/g;

  return str
    .replace(rSingleQuote, '\\\'')
    .replace(rDoubleQuote, '\\\"')
    .replace(rNewline, '\\n');
    // TODO: determine if anything else needs to be 
}

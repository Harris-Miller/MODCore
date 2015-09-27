
import DataHandler from '../handlers/data';

const dataHandler = new DataHandler();

const stack = Symbol['stack'];

export default class TemplateObjectCompiler {
  constructor() {
    this[stack] = [];

    this.frag = document.createDocumentFragment();
    this.morphs = {};


    this.current = this.frag;
  }

  handleChars(token) {
    let node = document.createTextNode(token.chars);
    this.current.appendChild(node);
  }

  handleStartTag(token) {
    let attrs = token.attributes;
    let node = document.createElement(`${token.tagName}`);

    if (attrs && Array.isArray(attrs)) {
      attrs.forEach(attr => {
        let [ name, values] = attr;

        node.setAttribute(name, values);
      });
    }

    this.current.appendChild(node);

    if (!token.selfClosing) {
      this[stack].push(this.current);
      this.current = node;
    }
  }

  handleEndTag(token) {
    this.current = this[stack].pop();
  }

  handleStartExp(token) {
    // determine what handler should be used

    // if empty attributes
    if (!token.attributes.length) {
      // either component or direct binding
      // TODO: check registry if component
      dataHandler.bind(this.current, this.morphs, token);
    }

  }

  handleEndExp(token) {

  }
}

import { UNDEFINED_DESC, NULL_DESC } from './metal';
import { meta as metaSymbol } from '../core/symbols';

// TODO: figure out what should stay and what should go
// all this stolen from Ember's meta object
function Meta(obj) {
  this.watching = {};
  this.cache = undefined;
  this.source = obj;
  this.deps = undefined;
  this.listeners = undefined;
  this.bindings = undefined;
  this.values = undefined;
}

export const EMPTY_META = new Meta(null);

export function meta(obj) {
  let metaObj = new Meta(obj);

  obj[metaSymbol] = metaObj;

  return obj;
}

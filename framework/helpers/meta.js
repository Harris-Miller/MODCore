
import { UNDEFINED_DESC, NULL_DESC } from './metal';
import { meta as metaSymbol } from '../core/symbols';

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
  let rtn = new Meta(obj);

  rtn[metaSymbol] = rtn;

  return rtn;
}
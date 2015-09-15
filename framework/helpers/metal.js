
import { isNone } from './util';

var _uuid = 0;

/**
 *
 *
 * @method uuid
 * @return {Number} the uuid
 */
export function uuid() {
  return ++_uuid;
}

const GUID_KEY = `__mod${+ new Date()}`;

export const UNDEFINED_DESC = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};

export const NULL_DESC = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: null
}

export const META_PROPERTY = {
  name: '__meta__',
  descriptor: NULL_DESC
};

export function canInvoke(obj, methodName) {
  return !!(obj && typeof obj[methodName] === 'function');
}

export function tryInvoke(obj, methodName, ...args) {
  if (canInvoke(obj, methodname)) {
    return args.length ? obj[methodName](...arg) : obj[methodName]();
  }
}

export function makeArray(obj) {
  if (isNone(obj)) {
    return [];
  }

  return Array.isArray(obj) ? obj : [obj];
}


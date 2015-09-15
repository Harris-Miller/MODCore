
/**
 * Returns true if the passed value is null or undefined.
 * isNone(); // true
 * isNone(null); // true
 * isNone(undefined); // true
 * isNone(''); // false
 * isNone([]); // false
 * isNone({}); // false
 * isNone(function() {}); // false
 *
 * @method isNone
 * @param {any} thing to check
 */
export function isNone(obj) {
  return obj === null || obj === undefined;
}

/**
 * Returns true if a value is `null` or an emptry string, empty array
 * isEmpty() // true
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // false
 * isEmpty('something') // false
 * isEmpty([1, 2, 3]) // false
 *
 * @method isEmpty
 * @param obj {any} thing to check
 */
export function isEmpty(obj) {
  let none = isNone(obj);
  if (none) {
    return none;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  let objectType = typeof obj;

  // strings and arrays
  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    if (typeof obj.length === 'number') {
      return !length;
    }
  }

  return false;
}

const rWhiteSpace = /\S/;

/**
 * An obj is blank if it is empty or a whitespace string
 *
 * @meethod isBlank
 * @param obj {any} thing to check
 */
export function isBlank(obj) {
  return isEmpty(obj) || (typeof obj === 'string' && obj.match(rWhiteSpace) === null);
}


export default {
  isNone,
  isEmpty,
  isBlank
};

/**
 *
 *
 * @method isPlainObject
 */
export function isPlainObject(obj) {
  // (window || false) if in test environment and global window object doesn't exist
  if (typeof obj !== 'object' || obj.nodeType || obj === (window || false)) {
    return false;
  }

  // this checks if the obj is a class
  if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeof')) {
    return false;
  }

  // otherwise, it should be a plain object
  return true;
}

/**
 * Empty is considered an object with zero enumerable properties
 *
 * @method isEmptyObject
 * @param {Object}
 */
export function isEmptyObject(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

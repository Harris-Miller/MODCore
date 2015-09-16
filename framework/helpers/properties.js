

/**
 * get method that allows deep chained properties
 *
 * @method get
 * @param obj {Object} the object the key exists on
 * @param key {String} the key we're looking for
 */
export function get(obj, key) {
  key = key.split('.');
  let chain = key.splice(1, key.length - 1);

  let rtn = obj[key];

  if (chain.length) {
    return get(rtn, chain.join('.'));
  }

  return rtn;
}

export function set(obj, key, value) {
  key = key.split('.');
  let chain = key.splice(1, key.length - 1);

  if (chain.length) {
    return set(obj[key], chain.join(','), value);
  }

  obj[key] = value;

  return value;
}

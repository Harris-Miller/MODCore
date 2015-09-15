

/**
 * get method that allows deep chained properties
 *
 * @method get
 * @param obj {Object} the object the key exists on
 * @param key {String} the key we're looking for
 */
export function get(obj, key) {

  // TODO: error handle obj and key params

  let chain = key.splice(1, key.length-1);

  if (!(key in obj)) {
    return obj;
  }

  let rtn = obj[key];

  if (chain.length) {
    return get(rtn, chain.join('.'));
  }

  return rtn;
}

export function getProperties(obj, ...keys) {
  var rtn = {};

  if (keys.length && Array.isArray(keys[0])) {
    keys = keys;
  }

  for (let key of keys) {
    rtn[key] = get(obj, key);
  }

  return rtn;
}

export function set(obj, key, value) {
  // TODO
}

export function setProperties(obj, ...values) {
  // TODO
}


function getCacheForObject(obj, cache) {
  if (!cache.has(obj)) {
    cache.set(obj, Object.create(null));
  }
  return cache.get(obj);
}

const computedPropertyCache = new WeakMap();
const dependentKeysCache = new WeakMap();

export {
  getCacheForObject,
  computedPropertyCache,
  dependentKeysCache
};

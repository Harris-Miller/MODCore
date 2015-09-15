
function getCacheForObject(obj, cache) {
  if (!cache.has(obj)) {
    cache.set(obj, Object.create(null));
  }
  return cache.get(obj);
}

const observerCache = new WeakMap();
const computedPropertyCache = new WeakMap();
const dependentKeysCache = new WeakMap();

export {
  getCacheForObject,
  observerCache,
  computedPropertyCache,
  dependentKeysCache
};

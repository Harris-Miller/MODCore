
export function getCacheForObject(obj, cache) {
  if (!cache.has(obj)) {
    cache.set(obj, Object.create(null));
  }
  return cache.get(obj);
}

export const observerCache = new WeakMap();
export const computedPropertyCache = new WeakMap();
export const dependentKeysCache = new WeakMap();

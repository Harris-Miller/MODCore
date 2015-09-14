
import { getCacheForObject, computedPropertyCache, dependentKeysCache} from './cache';
import { meta } from './symbols';

/**
 * sets a computed property to be cached, and recomputed on change of dependent keys
 *
 *
 */
export function computed(...args) {
  return function(target, key, descriptor) {

    let depKeysCache = getCacheForObject(target, dependentKeysCache);
    depKeysCache[key] = args;

    // only works on getters and setters
    let getter = descriptor.get;
    let setter = descriptor.set;

    if (!descriptor.get) {
      return;
    }

    // all computed properties should be enumerable
    descriptor.enumerable = true;

    descriptor.get = function() {
      let table = getCacheForObject(this, computedPropertyCache);
      if (key in table) {
        console.log('from cache');
        return table[key];
      }

      return table[key] = getter.call(this);
    };

    descriptor.set = function(value) {
      let table = getCacheForObject(this, computedPropertyCache);
      setter.call(this, value);
      table[key, value];
    };

    // TODO: how do we clear cache on dependent keys on change of those??

    return descriptor;
  };
}

export function observe(...args) {
  return function(target, key, descriptor) {

  }
}
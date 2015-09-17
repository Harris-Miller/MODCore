
import { getCacheForObject, computedPropertyCache, dependentKeysCache} from './cache';
import { meta } from './symbols';

/**
 * sets a computed property to be cached, and recomputed on change of dependent keys
 *
 *
 */
export function computed(...depKeys) {
  return function(target, key, descriptor) {

    console.log(target);

    let depKeysCache = getCacheForObject(target, dependentKeysCache);
    depKeysCache[key] = args;

    // only works on getters and setters
    let getter = descriptor.get;
    let setter = descriptor.set;

    // all computed properties should be enumerable
    descriptor.enumerable = true;

    // place an observer on the dependent keys
    // TODO: currently this only works on own keys
    for (let depKey of depKeys) {
      // TODO: update this to use property#get for key chains

      // TODO: how do I access the instance here?
    }

    if (getter) {
      descriptor.get = function() {
        // let table = getCacheForObject(this, computedPropertyCache);
        // if (key in table) {
        //   return table[key];
        // }

        return table[key] = getter.call(this);
      };
    }
    
    if (setter) {
      descriptor.set = function(value) {
        // let table = getCacheForObject(this, computedPropertyCache);
        setter.call(this, value);
        // table[key, value];
      };
    }

    return descriptor;
  };
}

export function observe(...args) {
  return function(target, key, descriptor) {

  }
}
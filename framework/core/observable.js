
import addMixin from './mixin-base';
import { meta } from './symbols';
import ModObject from './mod-object';
import {
  get as getProp,
  set as setProp
} from '../helpers/properties';
import {
  getCacheForObject,
  observerCache,
  computedPropertyCache,
  dependentKeysCache
} from './cache';
import {
  isNone,
  isPlainObject,
  isEmptyObject,
  getPropertyOwner
} from '../helpers/util';

/**
 *
 *
 *
 */
function getObjectCache(obj) {
  if (!observerCache.has(obj)) {
    observerCache.set(obj, new Map());
  }

  return observerCache.get(obj);
}

/**
 *
 *
 *
 */
function getObserversForKey(map, key) {
  if (!map.has(key)) {
    map.set(key, []);
  }

  return map.get(key);
}

/**
 *
 *
 *
 */
function fireObserversForKey(obj, key) {
  
}

/**
 *
 *
 *
 */
const observableObject = {

  addObserver(key, context, method) {

    // observers are placed on keys depending upon if the key is a value or if they are a computed property

    // first check if the key is a computed property
    if (key in this[meta].computedKeys) {
      // TODO: all computed properties are already set up for observation
      // we just need to add the context, and method to the observersForKey cache

      return;
    }
    
    // next we need to get the key's descriptor
    let propOwner;
    let keyDescriptor;
    // to do this, we need to determine first who owns the key so we can get it's descriptor
    // first look at the current instance
    if (this.hasOwnProperty(key)) {
      propOwner = this;
      keyDescriptor = Object.getOwnPropertyDescriptor(this, key);
    }
    // if not, look down the prototype change
    else {
      propOwner = getPropertyOwner(Object.getPrototypeOf(this).constructor, key);
      if (propOwner) {
        keyDescriptor = Object.getOwnPropertyDescriptor(propOwner, key);
      }
    }

    let values = this[meta].values;

    // if we found a descriptor, the property exists on the object
    // so determine if it is value or getter/setter
    if (keyDescriptor) {

      if (keyDescriptor.hasOwnProperty('value')) {
        // if it is a value, save the current value to meta data
        values[key] = this[key];

        // then, on `this` (not on propOwner, remember that's a prototype object, not an instance of the current type)
        // defineProperty with a get/set to proxy to meta data for the value and call observer functions along with
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: true,
          get: function() {
            return values[key];
          },
          set: function(value) {
            values[key] = value;
            this.notifyPropertyChange(key);
            return value;
          }
        });
      }
      else {
        // if it is a getter/setter, save the getter and setters, and reset them so the originals are called
        // AND we call the observer functions along with, only if get and/or set we defined on the oringal descriptor

        let desc = {
          configurable: true,
          enumerable: true
        };

        let getter = keyDescriptor.get;
        let setter = keyDescriptor.set;

        if (getter) {
          desc.get = function() {
            return getter.call(this);
          }
        }

        if (setter) {
          desc.set = function(value) {
            setter.call(this, value);
            this.notifyPropertyChange(key);
            return value;
          }
        }

        Object.defineProperty(this, key, desc);
      }
    }
    else {
      console.log('is unknown property');
      // if we didn't find a key in the object prototype change, create a setter only by that name
      // so if the property gets a value added to it later, we can handle it properly when it does
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: false,
        set: function(value) {
          // take the current value and stash it in cache
          values[key] = value;

          // then overwrite the current property descriptor
          Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: function() {
              return values[key];
            },
            set: function(value) {
              values[key] = value;
              this.notifyPropertyChange(key);
              return value;
            }
          });

          // and notifyPropertyChange for first time set
          this.notifyPropertyChange(key);
          return value;
        }
      });
    }

    // then add the context and method to the observers cache for the key
    let cache = getObjectCache(this);
    let observersForKey = getObserversForKey(cache, key);

    observersForKey.push({ context, method });
  },

  removeObserver(key, context, method) {
    let cache = getObjectCache(this);
    if (cache.has(key)) {
      let observersForKey = getObserversForKey(cache, key);

      for (let i = 0, l = observersForKey.length; i < l; i++) {
        if (context === observersForKey[i].context && method === observersForKey[i].method) {
          observersForKey.splice(i, 1);
        }
      }
    }
  },

  // get(key) {
  //   let rtn = getProp(this, key);
  //   // if plan object, wrap in CoreObject
  //   if (isPlainObject(rtn)) {
  //     this.key = rtn = new ModObject(rtn);
  //   }
  //   return rtn;
  // },

  // set(key, value) {
  //   setProp(this, key, value);
  //   // the set may be a key chain (eg: 'model.first');
  //   // we need to get back the actual object the final key lives on
  //   // and fireObserversForKey on THAT object and key
  //   fireObserversForKey(this, key);
  //   return value;
  // },

  getProperties(...keys) {
    if (!keys.length) {
      return null;
    }

    if (Array.isArray(keys[0])) {
      keys = keys[0];
    }

    let result = {};

    for(let key of keys) {
      result[key] = this.get(key);
    }

    return result;
  },

  setProperties(obj) {
    // TODO: defer this to helpers.properties#setProperties
    if (isNone(obj) || typeof obj !== 'object' || !isPlainObject(obj) || isEmptyObject(obj)) {
      return obj;
    }

    for (let key in obj) {
      set(obj, obj[key]);
    }

    return obj;
  },

  notifyPropertyChange(keyName) {
    let cache = getObjectCache(this);
    let observers = getObserversForKey(cache, keyName);

    for (let { context, method } of observers) {
      method.call(context, this[keyName]);
    }
  }
};

export default function observableMixin(target) {
  addMixin(target, observableObject);

  let originalConstructor = target;

  Object.defineProperty(target.prototype, 'isObservable', {
    value: true
  });

  // target.prototype.constructor = function(...args) {

  //   // get the computed properties cache for this
  //   let thisComputedPropertyCache = getCacheForObject(this, computedPropertyCache);

  //   // first, figure out all the computed keys for this object and who owns them
  //   let keyOwners = findComputedKeys(Object.getPrototypeOf(this).constructor);

  //   // and for all the owners of the computed keys...
  //   for (let owner of keyOwners) {
  //     // get the dependentKeysCache for each
  //     let cacheForOwner = dependentKeysCache.get(owner.obj);
  //     // and for each key in cacheForOwner
  //     for (let computedKey in cacheForOwner) {
  //       // for each computedKey in cacheForOwn
  //       for (let depedentKey of cacheForOwner[computedKey]) {
  //         // add an observer for it's dependentKeys
  //         this.addObserver(depedentKey, null, function(value) {
  //           delete thisComputedPropertyCache[computedKey];
  //         });
  //       }
  //     }
  //   }

  //   // and call the original constructor
  //   originalConstructor.call(this, ...args);
  // }
}

function findComputedKeys(obj, owners = []) {
  if (!obj) {
    return owners;
  }

  let cache = dependentKeysCache.get(obj);
  if (cache) {
    owners.push({ obj, keys: cache})
  }
  
  return findComputedKeys(obj.prototype, owners);
}

/* global EventEmitter2 */

import addMixin from './mixin-base';
import { meta } from './symbols';
import ModObject from './mod-object';
import { getCacheForObject, computedPropertyCache, dependentKeysCache} from './cache';

/**
 *
 *
 *
 */
const observerCache = new WeakMap();

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
  let cache = getObjectCache(obj);
  let observers = getObserversForKey(cache, key);

  for (let { context, method } of observers) {
    method.call(context, obj.get(key));
  }
}

/**
 *
 *
 *
 */
const observableObject = {

  addObserver(key, context, method) {
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

  get(key) {
    let rtn = this[key];
    // if plan object, wrap in CoreObject
    // TODO: remove jQuery dependency
    if ($.isPlainObject(rtn)) {
      this.key = rtn = new ModObject(rtn);
    }
    return rtn;
  },

  set(key, value) {
    this[key] = value;
    fireObserversForKey(this, key);
    return this;
  }
};

export default function observableMixin(target) {
  addMixin(target, observableObject);
  let originalConstructor = target;

  Object.defineProperty(target.prototype, 'isObservable', {
    value: true
  });

  target.prototype.constructor = function(...args) {

    // get the computed properties cache for this
    let thisComputedPropertyCache = getCacheForObject(this, computedPropertyCache);

    // first, figure out all the computed keys for this object and who owns them
    let keyOwners = findComputedKeys(Object.getPrototypeOf(this).constructor);

    // and for all the owners of the computed keys...
    for (let owner of keyOwners) {
      // get the dependentKeysCache for each
      let cacheForOwner = dependentKeysCache.get(owner.obj);
      // and for each key in cacheForOwner
      for (let computedKey in cacheForOwner) {
        // for each computedKey in cacheForOwn
        for (let depedentKey of cacheForOwner[computedKey]) {
          // add an observer for it's dependentKeys
          this.addObserver(depedentKey, null, function(value) {
            delete thisComputedPropertyCache[computedKey];
          });
        }
      }
    }

    // and call the original constructor
    originalConstructor.call(this, ...args);
  }
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

/**
 *
 *
 *
 */
function findOwnerOfKey(obj, key) {
  if (obj === null) {
    return null;
  }
  if (obj.hasOwnProperty(key)) {
    return obj;
  }
  return findOwnerOfKey(obj.prototype, key);
}
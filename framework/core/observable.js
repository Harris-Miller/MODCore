
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
function defineValueObserverDescriptor(obj, propName, incomingValue = null) {
  let values = obj[meta].values;

  // set the current value to invomcing Value or the current value of obj.propName to meta
  values[propName] = incomingValue || obj[propName];

  // then, on obj defineProperty with a get/set to proxy to meta data for the value
  // and call observer functions along with
  Object.defineProperty(obj, propName, {
    configurable: true,
    enumerable: true,
    get: function() {
      return values[propName];
    },
    set: function(value) {
      values[propName] = value;
      obj.notifyPropertyChange(propName);
      return value;
    }
  });
}

/**
 *
 *
 *
 */
function defineGetSetObserverDescriptor(obj, propName, propDesc) {
  // if it is a getter/setter, save the getter and setters, and reset them so the originals are called
  // AND we call the observer functions along with, only if get and/or set we defined on the oringal descriptor
  let desc = {
    configurable: true,
    enumerable: true
  };

  let getter = propDesc.get;
  let setter = propDesc.set;

  if (getter) {
    desc.get = function() {
      return getter.call(obj);
    }
  }

  if (setter) {
    desc.set = function(value) {
      setter.call(obj, value);
      obj.notifyPropertyChange(propName);
      return value;
    }
  }

  Object.defineProperty(obj, propName, desc);
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
        defineValueObserverDescriptor(this, key);
      }
      else {
        defineGetSetObserverDescriptor(this, key, keyDescriptor);
      }
    }
    else {
      // if we didn't find a key in the object prototype change, create a setter only by that name
      // so if the property gets a value added to it later, we can handle it properly when it does
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: false,
        set: function(value) {
          defineValueObserverDescriptor(this, key, value);

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
}

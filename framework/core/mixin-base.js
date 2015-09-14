
export default function addMixin(obj, mixin) {
  for (let key in mixin) {
    if (mixin.hasOwnProperty(key)) {
      addMixinProperty(obj.prototype, mixin, key);
    }
  }
}

// we want to retain getters and setters
// so instead of setting the property value to the obj under the same key
// we instead transfer the propert descriptor over
/**
 * To mix in the property, we want to retain the property descriptors of each property from the mixin
 * So instead of assigning the actual
 *
 * @method addMixinProperty
 * @private
 * @param obj {CoreObject} object to apply mixin from
 * @param mixin {Object} object that is being mixed in
 * @param key {String} key of the property to be mixed in
 */
function addMixinProperty(obj, mixin, key) {
  let descriptor = Object.getOwnPropertyDescriptor(mixin, key);

  if (descriptor && descriptor.hasOwnProperty('value')) {
    // if property is a function, make it immutable
    if (typeof descriptor.value === 'function') {
      descriptor.enumerable = false;
      descriptor.writable = false;
      descriptor.configurable = false;
    }
    // if it is an array, copy it
    else if (Array.isArray(descriptor.value)) {
      descriptor.value = descriptor.value.slice();
    }
    // if it is an object, copy it
    else if (typeof descriptor.value === 'object') {
      descriptor.value = Object.assign({}, descriptor.value);
    }

    // now define the property
    Object.defineProperty(obj, key, descriptor);
  }
}
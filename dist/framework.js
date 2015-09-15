define('person', ['exports', 'core/mod-object', 'core/decorators'], function (exports, ModObject, decorators) {

  'use strict';


  var Person = (function (_ModObject) {
    babelHelpers.inherits(Person, _ModObject);

    function Person(first, last) {
      babelHelpers.classCallCheck(this, Person);

      babelHelpers.get(Object.getPrototypeOf(Person.prototype), 'constructor', this).call(this);
      this.first = first;
      this.last = last;
    }

    babelHelpers.createDecoratedClass(Person, [{
      key: 'full',
      decorators: [decorators.computed('first', 'last')],
      get: function get() {
        return this.get('first') + ' ' + this.get('last');
      },
      set: function set(value) {
        var _value$split = value.split(' ');

        var _value$split2 = babelHelpers.slicedToArray(_value$split, 2);

        var first = _value$split2[0];
        var last = _value$split2[1];

        this.set('first', first);
        this.set('last', last);
      }
    }]);
    return Person;
  })(ModObject['default']);

  exports['default'] = Person;

});
define('core/cache', ['exports'], function (exports) {

  'use strict';

  exports.getCacheForObject = getCacheForObject;

  function getCacheForObject(obj, cache) {
    if (!cache.has(obj)) {
      cache.set(obj, Object.create(null));
    }
    return cache.get(obj);
  }

  var computedPropertyCache = new WeakMap();
  var dependentKeysCache = new WeakMap();

  exports.computedPropertyCache = computedPropertyCache;
  exports.dependentKeysCache = dependentKeysCache;

});
define('core/controller', ['exports', 'core/mod-object'], function (exports, ModObject) {

  'use strict';


  var Controller = (function (_ModObject) {
    babelHelpers.inherits(Controller, _ModObject);

    function Controller(instanceProperties) {
      babelHelpers.classCallCheck(this, Controller);

      babelHelpers.get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this, instanceProperties);

      // console.log(this);

      // this._normalizeModel();
      this._parseTemplate();
      this.render();
    }

    /**
     * Template can be either a selector, a DOM object, or a jquery object
     *
     * @method parseTemplate
     * @private
     * @param template
     */
    babelHelpers.createClass(Controller, [{
      key: '_normalizeModel',
      value: function _normalizeModel() {
        if (!(this.model instanceof ModObject['default'])) {
          this.model = new ModObject['default'](this.model);
        }
      }
    }, {
      key: '_parseTemplate',
      value: function _parseTemplate() {
        if (!this.template) {
          throw new Error('A controller must have a template set!');
        }
        this.template = jQuery(this.template);
        this._bindElements();
      }
    }, {
      key: '_bindElements',
      value: function _bindElements() {
        var _this = this;

        this.$bindedElements = this.template.find('[data-bind]');
        var model = this.get('model');

        this.$bindedElements.each(function (i, elm) {
          var $elm = $(elm);
          var key = $elm.data('bind');
          var to = $elm.data('to') || 'text';
          var of = $elm.data('of');

          if (key in model) {
            // add data down observer
            model.addObserver(key, _this, function (value) {
              // console.log(value);
              if (to === 'text') {
                $elm.text(value);
              } else if (to === 'html') {
                $elm.html(value);
              }
              // TODO: error handle `of`
              else if (to === 'attr') {
                  $elm.attr(of, value);
                } else if (to === 'prop') {
                  $elm.prop(of, value);
                }
            });

            // if element is editable, add data up observer (two-way binding)
            var tagName = $elm.prop('tagName').toLowerCase();
            if (editableTags.indexOf(tagName) >= 0) {
              $elm.on('change, input', function (e) {
                var value = $elm.val();
                model.set(key, value);
              });
            }
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var model = this.get('model');
        this.$bindedElements.each(function (i, elm) {
          var $elm = $(elm);
          var key = $elm.data('bind');
          var to = $elm.data('to') || 'text';
          var of = $elm.data('of');

          if (key in model) {
            var value = model.get(key);
            // console.log(value);
            if (to === 'text') {
              $elm.text(value);
            } else if (to === 'html') {
              $elm.html(value);
            }
            // TODO: error handle `of`
            else if (to === 'attr') {
                $elm.attr(of, value);
              } else if (to === 'prop') {
                $elm.prop(of, value);
              }
          }
        });
      }
    }]);
    return Controller;
  })(ModObject['default']);

  exports['default'] = Controller;function parseTemplate(template) {
    // TODO:
    // for right now, just wrap whatever is passed in jQuery
    return jQuery(template);
  }

  var editableTags = ['input', 'textarea', 'select'];

});
define('core/core-object', ['exports', 'core/cache', 'helpers/meta'], function (exports, cache, meta) {

  'use strict';


  var CoreObject = (function () {
    function CoreObject(instanceProperties) {
      babelHelpers.classCallCheck(this, CoreObject);

      meta.meta(this);

      if (instanceProperties !== undefined) {
        Object.assign(this, instanceProperties);
      }
    }

    babelHelpers.createClass(CoreObject, [{
      key: 'destroy',
      value: function destroy() {}
    }]);
    return CoreObject;
  })();

  exports['default'] = CoreObject;

});
define('core/decorators', ['exports', 'core/cache', 'core/symbols'], function (exports, cache, symbols) {

    'use strict';

    exports.computed = computed;
    exports.observe = observe;

    /**
     * sets a computed property to be cached, and recomputed on change of dependent keys
     *
     *
     */

    function computed() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return function (target, key, descriptor) {

            console.log(target);

            var depKeysCache = cache.getCacheForObject(target, cache.dependentKeysCache);
            depKeysCache[key] = args;

            // only works on getters and setters
            var getter = descriptor.get;
            var setter = descriptor.set;

            if (!descriptor.get) {
                return;
            }

            // all computed properties should be enumerable
            descriptor.enumerable = true;

            descriptor.get = function () {
                var table = cache.getCacheForObject(this, cache.computedPropertyCache);
                if (key in table) {
                    return table[key];
                }

                return table[key] = getter.call(this);
            };

            descriptor.set = function (value) {
                var table = cache.getCacheForObject(this, cache.computedPropertyCache);
                setter.call(this, value);
                table[(key, value)];
            };

            // TODO: how do we clear cache on dependent keys on change of those??

            return descriptor;
        };
    }

    function observe() {
        return function (target, key, descriptor) {};
    }

});
define('core/mixin-base', ['exports'], function (exports) {

  'use strict';


  exports['default'] = addMixin;

  function addMixin(obj, mixin) {
    for (var key in mixin) {
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
    var descriptor = Object.getOwnPropertyDescriptor(mixin, key);

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

});
define('core/mod-object', ['exports', 'core/core-object', 'core/observable'], function (exports, CoreObject, observable) {

  'use strict';


  var ModObject = (function (_CoreObject) {
    babelHelpers.inherits(ModObject, _CoreObject);

    function ModObject(instanceProperties) {
      babelHelpers.classCallCheck(this, _ModObject);

      babelHelpers.get(Object.getPrototypeOf(_ModObject.prototype), 'constructor', this).call(this, instanceProperties);
    }

    var _ModObject = ModObject;
    ModObject = observable['default'](ModObject) || ModObject;
    return ModObject;
  })(CoreObject['default']);

  exports['default'] = ModObject;

});
define('core/observable', ['exports', 'core/mixin-base', 'core/symbols', 'core/mod-object', 'core/cache', 'helpers/util'], function (exports, addMixin, symbols, ModObject, ___cache, util) {

  'use strict';



  exports['default'] = observableMixin;

  /* global EventEmitter2 */

  /**
   *
   *
   *
   */
  var observerCache = new WeakMap();

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
    var cache = getObjectCache(obj);
    var observers = getObserversForKey(cache, key);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = observers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _step.value;
        var context = _step$value.context;
        var method = _step$value.method;

        method.call(context, obj.get(key));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  /**
   *
   *
   *
   */
  var observableObject = {

    addObserver: function addObserver(key, context, method) {
      var cache = getObjectCache(this);
      var observersForKey = getObserversForKey(cache, key);

      observersForKey.push({ context: context, method: method });
    },

    removeObserver: function removeObserver(key, context, method) {
      var cache = getObjectCache(this);
      if (cache.has(key)) {
        var observersForKey = getObserversForKey(cache, key);

        for (var i = 0, l = observersForKey.length; i < l; i++) {
          if (context === observersForKey[i].context && method === observersForKey[i].method) {
            observersForKey.splice(i, 1);
          }
        }
      }
    },

    get: function get(key) {
      var rtn = this[key];
      // if plan object, wrap in CoreObject
      // TODO: remove jQuery dependency
      if ($.isPlainObject(rtn)) {
        this.key = rtn = new ModObject['default'](rtn);
      }
      return rtn;
    },

    set: function set(key, value) {
      // TODO: defer this to helpers.properties#set
      this[key] = value;
      fireObserversForKey(this, key);
      return value;
    },

    getProperties: function getProperties() {
      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      if (!keys.length) {
        return null;
      }

      if (Array.isArray(keys[0])) {
        keys = keys[0];
      }

      var result = {};

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          result[key] = this.get(key);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return result;
    },

    setProperties: function setProperties(obj) {
      // TODO: defer this to helpers.properties#setProperties
      if (util.isNone(obj) || typeof obj !== 'object' || !util.isPlainObject(obj) || util.isEmptyObject(obj)) {
        return obj;
      }

      for (var key in obj) {
        set(key, obj[key]);
      }

      return obj;
    }
  };
  function observableMixin(target) {
    addMixin['default'](target, observableObject);
    var originalConstructor = target;

    Object.defineProperty(target.prototype, 'isObservable', {
      value: true
    });

    target.prototype.constructor = function () {
      var _this = this;

      // get the computed properties cache for this
      var thisComputedPropertyCache = ___cache.getCacheForObject(this, ___cache.computedPropertyCache);

      // first, figure out all the computed keys for this object and who owns them
      var keyOwners = findComputedKeys(Object.getPrototypeOf(this).constructor);

      // and for all the owners of the computed keys...
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = keyOwners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var owner = _step3.value;

          // get the dependentKeysCache for each
          var cacheForOwner = ___cache.dependentKeysCache.get(owner.obj);
          // and for each key in cacheForOwner

          var _loop = function (computedKey) {
            // for each computedKey in cacheForOwn
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;

            try {
              for (_iterator4 = cacheForOwner[computedKey][Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var depedentKey = _step4.value;

                // add an observer for it's dependentKeys
                _this.addObserver(depedentKey, null, function (value) {
                  delete thisComputedPropertyCache[computedKey];
                });
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                  _iterator4['return']();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          };

          for (var computedKey in cacheForOwner) {
            var _iteratorNormalCompletion4;

            var _didIteratorError4;

            var _iteratorError4;

            var _iterator4, _step4;

            _loop(computedKey);
          }
        }

        // and call the original constructor
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      originalConstructor.call.apply(originalConstructor, [this].concat(args));
    };
  }

  function findComputedKeys(_x2) {
    var _arguments = arguments;
    var _again = true;

    _function: while (_again) {
      var obj = _x2;
      owners = cache = undefined;
      _again = false;
      var owners = _arguments.length <= 1 || _arguments[1] === undefined ? [] : _arguments[1];

      if (!obj) {
        return owners;
      }

      var cache = ___cache.dependentKeysCache.get(obj);
      if (cache) {
        owners.push({ obj: obj, keys: cache });
      }

      _arguments = [_x2 = obj.prototype, owners];
      _again = true;
      continue _function;
    }
  }

  /**
   *
   *
   *
   */
  function findOwnerOfKey(_x3, _x4) {
    var _again2 = true;

    _function2: while (_again2) {
      var obj = _x3,
          key = _x4;
      _again2 = false;

      if (obj === null) {
        return null;
      }
      if (obj.hasOwnProperty(key)) {
        return obj;
      }
      _x3 = obj.prototype;
      _x4 = key;
      _again2 = true;
      continue _function2;
    }
  }

});
define('core/symbols', ['exports'], function (exports) {

	'use strict';

	var meta = Symbol('meta');

	exports.meta = meta;

});
define('helpers/meta', ['exports', 'helpers/metal', 'core/symbols'], function (exports, metal, symbols) {

  'use strict';

  exports.meta = meta;

  function Meta(obj) {
    this.watching = {};
    this.cache = undefined;
    this.source = obj;
    this.deps = undefined;
    this.listeners = undefined;
    this.bindings = undefined;
    this.values = undefined;
  }

  var EMPTY_META = new Meta(null);

  function meta(obj) {
    var rtn = new Meta(obj);

    rtn[symbols.meta] = rtn;

    return rtn;
  }

  exports.EMPTY_META = EMPTY_META;

});
define('helpers/metal', ['exports', 'helpers/util'], function (exports, util) {

  'use strict';

  exports.uuid = uuid;
  exports.canInvoke = canInvoke;
  exports.tryInvoke = tryInvoke;
  exports.makeArray = makeArray;

  var _uuid = 0;

  /**
   *
   *
   * @method uuid
   * @return {Number} the uuid
   */

  function uuid() {
    return ++_uuid;
  }

  var GUID_KEY = '__mod' + +new Date();

  var UNDEFINED_DESC = {
    configurable: true,
    writable: true,
    enumerable: false,
    value: undefined
  };

  var NULL_DESC = {
    configurable: true,
    writable: true,
    enumerable: false,
    value: null
  };

  var META_PROPERTY = {
    name: '__meta__',
    descriptor: NULL_DESC
  };

  function canInvoke(obj, methodName) {
    return !!(obj && typeof obj[methodName] === 'function');
  }

  function tryInvoke(obj, methodName) {
    if (canInvoke(obj, methodname)) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return args.length ? obj[methodName].apply(obj, babelHelpers.toConsumableArray(arg)) : obj[methodName]();
    }
  }

  function makeArray(obj) {
    if (util.isNone(obj)) {
      return [];
    }

    return Array.isArray(obj) ? obj : [obj];
  }

  exports.UNDEFINED_DESC = UNDEFINED_DESC;
  exports.NULL_DESC = NULL_DESC;
  exports.META_PROPERTY = META_PROPERTY;

});
define('helpers/properties', ['exports'], function (exports) {

  'use strict';

  exports.get = get;
  exports.getProperties = getProperties;
  exports.set = set;
  exports.setProperties = setProperties;

  function get(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var obj = _x,
          key = _x2;
      chain = rtn = undefined;
      _again = false;

      // TODO: error handle obj and key params

      var chain = key.splice(1, key.length - 1);

      if (!(key in obj)) {
        return obj;
      }

      var rtn = obj[key];

      if (chain.length) {
        _x = rtn;
        _x2 = chain.join('.');
        _again = true;
        continue _function;
      }

      return rtn;
    }
  }

  function getProperties(obj) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    var rtn = {};

    if (keys.length && Array.isArray(keys[0])) {
      keys = keys;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        rtn[key] = get(obj, key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return rtn;
  }

  function set(obj, key, value) {
    // TODO
  }

  function setProperties(obj) {
    // TODO
  }

});
define('helpers/util', ['exports'], function (exports) {

  'use strict';

  exports.isNone = isNone;
  exports.isEmpty = isEmpty;
  exports.isBlank = isBlank;
  exports.isPlainObject = isPlainObject;
  exports.isEmptyObject = isEmptyObject;

  function isNone(obj) {
    return obj === null || obj === undefined;
  }

  /**
   * Returns true if a value is `null` or an emptry string, empty array
   * isEmpty() // true
   * isEmpty(null) // true
   * isEmpty(undefined) // true
   * isEmpty('') // true
   * isEmpty([]) // true
   * isEmpty({}) // false
   * isEmpty('something') // false
   * isEmpty([1, 2, 3]) // false
   *
   * @method isEmpty
   * @param obj {any} thing to check
   */

  function isEmpty(obj) {
    var none = isNone(obj);
    if (none) {
      return none;
    }

    if (typeof obj.size === 'number') {
      return !obj.size;
    }

    var objectType = typeof obj;

    // strings and arrays
    if (typeof obj.length === 'number' && objectType !== 'function') {
      return !obj.length;
    }

    if (objectType === 'object') {
      if (typeof obj.length === 'number') {
        return !length;
      }
    }

    return false;
  }

  var rWhiteSpace = /\S/;

  /**
   * An obj is blank if it is empty or a whitespace string
   *
   * @meethod isBlank
   * @param obj {any} thing to check
   */

  function isBlank(obj) {
    return isEmpty(obj) || typeof obj === 'string' && obj.match(rWhiteSpace) === null;
  }

  exports['default'] = {
    isNone: isNone,
    isEmpty: isEmpty,
    isBlank: isBlank
  };

  /**
   *
   *
   * @method isPlainObject
   */

  function isPlainObject(obj) {
    // (window || false) if in test environment and global window object doesn't exist
    if (typeof obj !== 'object' || obj.nodeType || obj === (window || false)) {
      return false;
    }

    // this checks if the obj is a class
    if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeof')) {
      return false;
    }

    // otherwise, it should be a plain object
    return true;
  }

  /**
   * Empty is considered an object with zero enumerable properties
   *
   * @method isEmptyObject
   * @param {Object}
   */

  function isEmptyObject(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

});
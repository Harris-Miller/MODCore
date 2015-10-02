
// an object (target) can be observed by other object (listener)
// when a target object changes, it notifies the listner objects that are listening too it
// the listener objects are responsible for their own callbacks

const observableObject = {

  /**
   * A week map of targets that this object is observing. If those objects are GC'd, we automatically stop observing them!
   *
   * @property observer
   * @type WeakMap
   *
   * TODO: not sure if it should live here or not?
   * probable needs to be part of constructor for class this is being mixed into
   */
  observers: new WeakMap(),

  /**
   * A set of objects that are listening to this object. Will iterate through them when notifying changes
   *
   *
   */
  listeners: new Set(),

  _boundObserverCallback: null,

  /**
   * Adds a listener object to target. A listener object can listen to itself
   *
   * @method addListen
   * @param obj {Object}
   */
  addListener(obj) {
    // if this.listeners.size === 0, safe to assume we need to add the observer
    if (!this.listeners.size) {
      Object.observe(this, (this._boundObserverCallback = this.notifyListeners.bind(this))); // TODO, save ref to bound function?
    }

    this.listeners.add(obj);
  },

  removeListener(obj) {
    this.listeners.delete(obj);

    // if there are no more listeners remaning, unobserve this object
    if (!this.listeners.size) {
      Object.unobserve(this, this._boundObserverCallback);
    }
  },

  // TODO: maybe have this more private
  notifyListeners(changes) {
    this.listeners.forEach(listener => {
      changes.forEach(change => {
        listener.observedObjectChanged(change);
      });
    })
  }

  /**
   * Adds an observer onto a target
   *
   *
   */
  addObserver(target, propName, callback) {
    
  },

  removeObserver(target, propName, callback) {

  },

  observedObjectChanged(change) {
    let { name } = change;

    let propNames = this.observers.get(object);
    if (propNames && (name in propNames)) {
      propNames[name].forEach(callback => {
        callback.call(this, change);
      });
    }
  }
}

const observerMap = new Map();

/**
 * A single callback will be sent to Object.observe for any object
 * that callback will then look at assigned observers in a map
 * and fire them based on the key being looked at on hte observed object
 *
 *
 */
function createObservation(obj, key, type, context, expression) {

  // TODO: assert that `type` is one of ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]

  if (!observerMap.has(obj)) {
    createObserverMapValue(obj);
  }

  let mapValue = observermap.get(obj);
  let typeHash = mapValue.types;
  let typePropNameHash = typeHash[type];

  // now we add to typePropNameHash
  // first create a prop on typePropNameHash for key if it doesn't already exist
  if (!typePropNameHash.hasOwnProperty(key)) {
    typePropNameHash[key] = [];
  }

  // then add the context and expression
  typePropNameHash[key].push({
    context,
    expression
  });
}

function createObserverMapValue(obj) {
   let mapValue = {
       // this is the object that we will send into Object.observe
       // we want to keep a reference too it for when we deconstruct an object later on
      callback = createObserverCallback(obj),
      // this is a hash of propertynames that house individual callbacks from other objects
      // each key of the hash will contain an object of context and an expression
      types = generateChangeTypesHash()
    };

    observerMap.set(obj, mapValue);

    Object.observe(obj, mapValue.callback)
}

function generateChangeTypesHash() {
  return {
    add: {},
    update: {},
    delete: {},
    reconfigure: {},
    setPrototype: {}
  };
}

function createObserverCallback(obj) {
  // this creates a functions to be stored later so it can be used for Object.unobserve

  return function(changes) {

    let objCallbacks = observerMap(obj);

    changes.forEach(change => {
      let { name, type } = change;

      // for adds, we want to fire both adds and updates
      // this is so observers for properties that may not exist will get fires when first added
      // it is important for data binding

      if (type === 'add') {
        // fire both add and update
        objCallbacks.add.forEach(hash => {
          hash.expression.call(hash.context, change);
        });
        objCallbacks.update.forEach(hash => {
          hash.expression.call(hash.context, change);
        });
      }
      else {
        // otherwise, fire the callbacks for the type
        objCallbacks[type].forEach(hash => {
          hash.expression.call(hash.context, change);
        });
      }
    });
  }
}


const observableObject = {

  // when adding an observer, you choose the obj TOO observe
  addObserver(obj, key, type, expression) {
    createObservation(obj, key, type, this, expression);
  },

  removeObserver(obj, key, type, expression) {
    
  }
}
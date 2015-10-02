

/**
 * addObserver
 *
 * @method addObserver
 * @param obj {Object} the object to observe
 * @param callback {Function} the function to be called when observer fires
 */
function addObserver(obj, callback) {
  Object.observe(obj, callback);
}


function createObserverCallback(obj, propName, expression) {
  // this creates a functions to be stored later so it can be used for Object.unobserve

  return function(changes) {

    changes.forEach(change => {
      let { name, object, type } = change;

      // for pretty much all situations, we're looking at both 'add' and 'update' to do the same thing
      // this may change in the future however
      if (type === 'update' || type === 'add') {
        
      }
    });
  }
}

function createOnAddCallback(obj, propName, expression) {

}

function createOnUpdateCallback(obj, propName, expression) {

}

function createonDeleteCallback(obj, propName, expression) {

}


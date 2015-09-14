
import cache from './cache';
import { meta } from './symbols';

export default class CoreObject {
  constructor(instanceProperties) {
    if (instanceProperties !== undefined) {
      Object.assign(this, instanceProperties);
    }
  }

  destroy() {

  }
}

Object.defineProperty(CoreObject.prototype, meta, {
  value: {
    dependentKeys: {}
  }
});



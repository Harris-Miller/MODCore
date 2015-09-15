
import cache from './cache';
import { meta } from '../helpers/meta';

export default class CoreObject {
  constructor(instanceProperties) {

    meta(this);

    if (instanceProperties !== undefined) {
      Object.assign(this, instanceProperties);
    }
  }

  destroy() {

  }
}

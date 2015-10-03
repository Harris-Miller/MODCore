
import cache from './cache';
import { meta } from '../helpers/meta';

/**
 *
 *
 *
 */
export default class CoreObject {
  constructor() {
    meta(this);

    this.isDestroying = false;
    this.isDestroyed = false;
  }

  willDestroy() {

  }

  destroy() {
    this.isDestroying = true;
    this.willDestroy();
    this.isDestroyed = true;
  }
}

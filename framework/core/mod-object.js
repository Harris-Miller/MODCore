
import CoreObject from './core-object';
import observable from './observable';

/**
 *
 *
 * @class ModObject
 * @uses observable
 * @constructor
 */
@observable
export default class ModObject extends CoreObject {
  constructor() {
    super();
  }
}

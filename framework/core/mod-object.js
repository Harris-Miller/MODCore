
import CoreObject from './core-object';
import observable from './observable';

@observable
export default class ModObject extends CoreObject {
  constructor(instanceProperties) {
    super(instanceProperties);
  }
}

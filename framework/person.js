
import ModObject from './core/mod-object';
import { computed } from './core/decorators';

export default class Person extends ModObject {
  constructor(instanceProperties) {
    super(instanceProperties);
  }

  // @computed('first', 'last')
  get full() {
    return `${this.first} ${this.last}`;
  }
  set full(value) {
    let [first, last] = value.split(' ');
    this.first = first;
    this.last = last;
  }
}

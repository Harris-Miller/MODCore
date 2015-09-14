
import ModObject from './core/mod-object';
import { computed } from './core/decorators';

export default class Person extends ModObject {
  constructor(first, last) {
    super();
    this.first = first;
    this.last = last;
  }

  @computed('first', 'last')
  get full() {
    return `${this.get('first')} ${this.get('last')}`;
  }
  set full(value) {
    let [first, last] = value.split(' ');
    this.set('first', first);
    this.set('last', last);
  }
}

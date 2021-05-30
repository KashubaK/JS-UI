import { elements } from './elements';
import { Mutable } from './Mutable';

export class View extends Mutable {
  elements = elements({ bind: this });

  render(): HTMLElement {
    return this.elements.div();
  }
}
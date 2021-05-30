import { elements } from './elements';

export class View implements Subscribable {
  __observers: (() => void)[] = [];

  elements = elements({ bind: this });

  constructor() {
    return new Proxy<View>(this, {
      set: (view, key: keyof View, value: any): boolean => {
        view[key] = value;
  
        this.__observers.forEach(func => func());
  
        return true;
      },
    });
  }

  onUpdate(cb: () => void): void {
    this.__observers.push(cb);
  }

  render(): HTMLElement {
    return this.elements.div();
  }
}
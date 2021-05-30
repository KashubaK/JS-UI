import { elements } from './elements';

export class View {
  __observers: (() => void)[] = [];

  elements = elements({ bind: this });

  constructor() {
    return new Proxy<View>(this, {
      set: (view, key: keyof View, value: any, r): boolean => {
        view[key] = value;
  
        this.__observers.forEach(func => func());
  
        return true;
      },
    });
  }

  __onUpdate(cb: () => void): void {
    this.__observers.push(cb);
  }

  render(): HTMLElement {
    return this.elements.div();
  }
}
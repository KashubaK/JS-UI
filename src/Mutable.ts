export class Mutable<T = unknown> implements Subscribable {
  __observers: (() => void)[] = [];

  static KEYS_TO_IGNORE = [
    '__observers',
    'onUpdate',
    'elements',
    '__isProxied',
  ]

  constructor(initial?: T) {
    Object.assign(this, initial);

    const fireObservers = (): void => {
      this.__observers.forEach(func => func());
    }

    const validator = {
      get: (target: any, key: string): any => {
        if (!Mutable.KEYS_TO_IGNORE.includes(key) && typeof target[key] === 'object' && typeof target[key] !== 'function' && !target[key].__isProxied) {
          const proxy = new Proxy(target[key], validator);
          proxy.__isProxied = true;

          target[key] = proxy;
        } 

        return target[key];
      },
      set: (mutable: Mutable, key: keyof Mutable, value: any) => {
        mutable[key] = value;

        if (!Mutable.KEYS_TO_IGNORE.includes(key)) {
          fireObservers();
        }

        return true;
      },
    }; 

    return new Proxy<Mutable>(this, validator);
  }

  onUpdate(cb: () => void): void {
    this.__observers.push(cb);
  }
}
export class Mutable<T = unknown> implements Subscribable {
  __observers: (() => void)[] = [];

  constructor(initial?: T) {
    Object.assign(this, initial);

    const validator = {
      get: (target: any, key: keyof typeof target): any => {
        if (typeof target[key] === 'object') {
          return new Proxy(target[key], validator)
        } else {
          return target[key];
        }
      },
      set: (mutable: Mutable, key: keyof Mutable, value: any) => {
        mutable[key] = value;

        this.__observers.forEach(func => func());

        return true;
      },
    }; 

    return new Proxy<Mutable>(this, validator);
  }

  onUpdate(cb: () => void): void {
    this.__observers.push(cb);
  }
}
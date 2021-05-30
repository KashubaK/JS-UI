import { elements } from './elements';
export type JSONObject = Record<string | number | symbol, unknown>;

export class View<State extends JSONObject = JSONObject> {
  state: State;
  __observers: (() => void)[] = [];

  elements = elements({ bind: this });

  constructor(defaultState: State) {
    this.state = new Proxy<State>(defaultState, {
      set: (state, key: keyof State, value: any, r): boolean => {
        state[key] = value;
  
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
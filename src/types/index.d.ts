interface Element {
  __JS_UI_STORE: ElementDataStore;
}

interface Subscribable {
  onUpdate: (cb: () => void) => void;
}

type ElementProps<E extends HTMLElement = HTMLElement> = string | (() => string) | Partial<E> | (() => Partial<E>);

type ElementDataStore = {
  position: number;
  subscribable?: Subscribable;
  propObjects: ElementProps[];
}

type Primitive = string | number | boolean | null | undefined;
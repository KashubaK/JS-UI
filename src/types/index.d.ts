interface Element {
  __JS_UI_STORE: ElementDataStore;
}

interface Subscribable {
  onUpdate: (cb: () => void) => void;
}

type ElementDataStore = {
  position: number;
  subscribable?: Subscribable;
}

type Primitive = string | number | boolean | null | undefined;
import { View } from ".";

export type FalsyPrimitive =  '' | 0 | false | null | undefined;

export class DynamicElement<ElementType extends HTMLElement = HTMLElement> {
  parent?: HTMLElement;
  index: number = -1;

  element: ElementType;
  shouldRender: () => Primitive;

  constructor(shouldRender: () => Primitive, element: ElementType) {
    this.element = element;
    this.shouldRender = shouldRender;

    this.conditionallyMount = this.conditionallyMount.bind(this);

    if (!element.__JS_UI_STORE.subscribable) {
      throw new Error('JS-UI: You cannot construct a DynamicElement with an element that is not bound to a Subscribable.');
    }

    element.__JS_UI_STORE.subscribable.onUpdate(this.conditionallyMount)
  }

  conditionallyMount(): void {
    const render = this.shouldRender();

    if (render) {
      if (!this.parent) {
        throw new Error('DynamicElement missing parentElement');
      }

      this.mount(this.parent);
    } else {
      this.unmount();
    }
  }

  clone(): DynamicElement<ElementType> {
    const clone = new DynamicElement<ElementType>(this.shouldRender, this.element.cloneNode(true) as ElementType);

    return clone;
  }

  render() {
    if (this.shouldRender()) return this.element;

    return null;
  }

  setParent(parent: HTMLElement): void {
    this.parent = parent;
  }

  setIndex(index: number) {
    this.index = index;
    this.element.__JS_UI_STORE.position = index;
  }

  getElementToInsertBefore(parent: HTMLElement): HTMLElement | null {
    let element: HTMLElement | null = null;
  
    Array.from(parent.children).forEach(child => {
      if (element) return;

      const index = child.__JS_UI_STORE.position || 0;

      if (index > this.index) {
        element = child as HTMLElement;
      }
    });

    return element;
  }

  mount(parent: HTMLElement): void {
    const elementToInsertBefore = this.getElementToInsertBefore(parent);

    if (elementToInsertBefore) {
      parent.insertBefore(this.element, elementToInsertBefore);
    } else {
      parent.appendChild(this.element);
    }
  }

  unmount(): void {
    this.element.parentElement?.removeChild(this.element);
  }
}
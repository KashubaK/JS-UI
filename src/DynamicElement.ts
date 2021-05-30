import { View } from ".";

export class DynamicElement<ElementType extends HTMLElement = HTMLElement> {
  parent?: HTMLElement;
  element: ElementType;
  index: number = -1;
  view: View;

  shouldRender: () => boolean;

  constructor(element: ElementType, view: View, shouldRender: () => boolean) {
    this.view = view;
    this.element = element;
    this.shouldRender = shouldRender;

    view.__onUpdate(() => this.conditionallyMount());
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
    const clone = new DynamicElement<ElementType>(this.element.cloneNode(true) as ElementType, this.view, this.shouldRender);

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
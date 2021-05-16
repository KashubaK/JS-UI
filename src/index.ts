'use strict';

export type JSONObject = Record<string | number | symbol, unknown>;

export type ElementProps<E extends HTMLElement> = string | (() => string) | Partial<E> | (() => Partial<E>);
export type DivElementProps = ElementProps<HTMLDivElement>;

export class View<State extends JSONObject = JSONObject> {
  state: State;
  __observers: (() => void)[] = [];

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
    return div();
  }
}

export class App<T extends View> {
  rootElement: HTMLElement | null;

  constructor(rootSelector: string, view: T) {
    this.rootElement = document.querySelector(rootSelector);

    if (!this.rootElement) {
      throw new Error('Failed to find root element');
    }

    const rootRenderResult = view.render();

    this.rootElement.appendChild(rootRenderResult);
  }
}

function evaluateProps<E extends HTMLElement>(props: ElementProps<E>): Partial<E> {
  let propObject: Partial<E> = {};

  if (typeof props == 'string') {
    propObject.innerText = props;
  } else if (typeof props == 'function') {
    const returnValue = props();

    if (typeof returnValue == 'string') {
      propObject.innerText = returnValue;
    } else {
      propObject = returnValue;
    }
  } else {
    propObject = props;
  }

  return propObject;
}

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
    console.log('wow!', this.element)
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
    this.element.setAttribute('data-js-ui-index', `${index}`);
  }

  getElementToInsertBefore(parent: HTMLElement): HTMLElement | null {
    let element: HTMLElement | null = null;
  
    Array.from(parent.children).forEach(child => {
      if (element) return;

      const index = parseInt(child.getAttribute('data-js-ui-index') || '0');

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

export type ConditionalElementOpts = {
  parent: HTMLElement;
  view: View;
  shouldRender: () => boolean;
}

export function clone<E extends HTMLElement>(element: E | DynamicElement<E>): E | DynamicElement<E> {
  if (element instanceof DynamicElement) {
    return element.clone();
  }

  return element.cloneNode(true) as E;
}

export function bound<E extends HTMLElement>(elementCreator: ElementCreator<E>, view: View, props: ElementProps<E>): E {
  return elementCreator.bind(view)(props);
}

export function conditional<E extends HTMLElement>(element: E, { parent, view, shouldRender }: ConditionalElementOpts): DynamicElement<E> {
  const dynamicElement = new DynamicElement(element, view, shouldRender);
  dynamicElement.setParent(parent);

  return dynamicElement;
}

export function parent<E extends HTMLElement>(parentElement: E, children: (HTMLElement | DynamicElement | null)[]): E {
  const currentChildren = parentElement.children;
  if (currentChildren.length > 0) return parentElement;

  children.forEach((child, index) => {
    if (!child) return;
    if (child instanceof DynamicElement) {
      child.setParent(parentElement);
      child.setIndex(index);
      child.conditionallyMount();

      console.log('assigned dynamic index', index, child.element);
    }

    if (!(child instanceof HTMLElement)) return;

    child.setAttribute('data-js-ui-index', `${index}`);

    parentElement.appendChild(child);
  });

  return parentElement;
}

export type ElementCreator<E extends HTMLElement> = (this: View | void, propsOrContent?: ElementProps<E>, props?: ElementProps<E>) => E;

export function generateElementCreator<E extends HTMLElement>(tagName: string): ElementCreator<E> {
  return function elementCreator(this: View | void, propsOrContent?: ElementProps<E>, props?: ElementProps<E>): E {
    let propsToAssign: Partial<E> = {};

    const element = document.createElement(tagName) as E;
    let handlingUpdates = false;

    function assignProps(this: View | void) {
      if (propsOrContent) propsToAssign = evaluateProps(propsOrContent);

      if (this && !handlingUpdates) {
        handlingUpdates = true;

        this.__onUpdate(() => {
          assignProps();
        });
      }
  
      Object.assign(element, propsToAssign);
    }

    if (this instanceof View) {
      assignProps.bind(this)();
    } else {
      assignProps();
    }

    return element;
  }
}

export const div = generateElementCreator<HTMLDivElement>('div');
export const form = generateElementCreator<HTMLFormElement>('form');
export const label = generateElementCreator<HTMLLabelElement>('label');
export const input = generateElementCreator<HTMLInputElement>('input');
export const h1 = generateElementCreator<HTMLHeadingElement>('h1');
export const button = generateElementCreator<HTMLButtonElement>('button');


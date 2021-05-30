import { getInitialElementStore, View } from ".";

export type ElementProps<E extends HTMLElement> = string | (() => string) | Partial<E> | (() => Partial<E>);

function evaluateProps<E extends HTMLElement>(propObjects: ElementProps<E>[]): Partial<E> {
  let propObject: Partial<E> = {};

  propObjects.forEach(props => {
    if (typeof props == 'string') {
      propObject.innerText = props;
    } else if (typeof props == 'function') {
      const returnValue = props();
  
      if (typeof returnValue == 'string') {
        propObject.innerText = returnValue;
      } else {
        Object.assign(propObject, returnValue);
      }
    } else {
      Object.assign(propObject, props);
    }
  })

  return propObject;
}

export type ElementCreator<E extends HTMLElement = HTMLElement> = (this: Subscribable | void, ...propsObjects: (ElementProps<E>)[]) => E;

export function generateElementCreator<E extends HTMLElement>(tagName: string): ElementCreator<E> {
  return function elementCreator(this: Subscribable | void, ...propObjects: (ElementProps<E>)[]): E {
    let propsToAssign: Partial<E> = {};

    const element = document.createElement(tagName) as E;

    element.__JS_UI_STORE = getInitialElementStore({ subscribable: this || undefined });

    let handlingUpdates = false;

    function assignProps(this: Subscribable | void) {
      if (propObjects) propsToAssign = evaluateProps(propObjects);

      if (this && !handlingUpdates) {
        handlingUpdates = true;

        this.onUpdate(() => {
          assignProps();
        });
      }
  
      Object.assign(element, propsToAssign);
    }

    if (this) {
      assignProps.bind(this)();
    } else {
      assignProps();
    }

    return element;
  }
}

export type GenerateElementsOpts = {
  bind?: Subscribable;
}

export function elements({ bind }: GenerateElementsOpts) {
  return {
    div: generateElementCreator<HTMLDivElement>('div').bind(bind),
    form: generateElementCreator<HTMLFormElement>('form').bind(bind),
    label: generateElementCreator<HTMLLabelElement>('label').bind(bind),
    input: generateElementCreator<HTMLInputElement>('input').bind(bind),
    h1: generateElementCreator<HTMLHeadingElement>('h1').bind(bind),
    button: generateElementCreator<HTMLButtonElement>('button').bind(bind),
  } as const;
}
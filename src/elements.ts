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

export type ElementCreator<E extends HTMLElement = HTMLElement> = (this: View | void, ...propsObjects: (ElementProps<E>)[]) => E;

export function generateElementCreator<E extends HTMLElement>(tagName: string): ElementCreator<E> {
  return function elementCreator(this: View | void, ...propObjects: (ElementProps<E>)[]): E {
    let propsToAssign: Partial<E> = {};

    const element = document.createElement(tagName) as E;

    element.__JS_UI_STORE = getInitialElementStore();

    let handlingUpdates = false;

    function assignProps(this: View | void) {
      if (propObjects) propsToAssign = evaluateProps(propObjects);

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

export type GenerateElementsOpts = {
  bind?: View;
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
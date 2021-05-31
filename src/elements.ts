import { getInitialElementStore, View } from ".";

export function evaluateProps<E extends HTMLElement>(propObjects: ElementProps<E>[]): Partial<E> {
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

    element.__JS_UI_STORE = getInitialElementStore({ subscribable: this || undefined, propObjects });

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
    ul: generateElementCreator<HTMLUListElement>('ul').bind(bind),
    ol: generateElementCreator<HTMLOListElement>('ol').bind(bind),
    li: generateElementCreator<HTMLLIElement>('li').bind(bind),
    span: generateElementCreator<HTMLSpanElement>('span').bind(bind),
    strong: generateElementCreator<HTMLElement>('strong').bind(bind),
    b: generateElementCreator<HTMLElement>('b').bind(bind),
    em: generateElementCreator<HTMLElement>('em').bind(bind),
    h1: generateElementCreator<HTMLHeadingElement>('h1').bind(bind),
    h2: generateElementCreator<HTMLHeadingElement>('h2').bind(bind),
    h3: generateElementCreator<HTMLHeadingElement>('h3').bind(bind),
    h4: generateElementCreator<HTMLHeadingElement>('h4').bind(bind),
    h5: generateElementCreator<HTMLHeadingElement>('h5').bind(bind),
    h6: generateElementCreator<HTMLHeadingElement>('h6').bind(bind),
    button: generateElementCreator<HTMLButtonElement>('button').bind(bind),
    form: generateElementCreator<HTMLFormElement>('form').bind(bind),
    label: generateElementCreator<HTMLLabelElement>('label').bind(bind),
    input: generateElementCreator<HTMLInputElement>('input').bind(bind),
  } as const;
}
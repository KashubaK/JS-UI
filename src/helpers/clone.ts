import { DynamicElement } from "../DynamicElement";

export function clone<E extends HTMLElement>(element: E | DynamicElement<E>): E | DynamicElement<E> {
  if (element instanceof DynamicElement) {
    return element.clone();
  }

  return element.cloneNode(true) as E;
}
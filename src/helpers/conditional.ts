import { DynamicElement } from "../DynamicElement";

export function conditional<E extends HTMLElement>(shouldRender: () => Primitive, element: E): DynamicElement<E> {
  const dynamicElement = new DynamicElement(shouldRender, element);

  return dynamicElement;
}
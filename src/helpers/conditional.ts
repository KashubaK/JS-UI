import { DynamicElement } from "../DynamicElement";
import { View } from "../View";

export type ConditionalElementOpts = {
  parent: HTMLElement;
  view: View;
  shouldRender: () => boolean;
}

export function conditional<E extends HTMLElement>(element: E, { parent, view, shouldRender }: ConditionalElementOpts): DynamicElement<E> {
  const dynamicElement = new DynamicElement(element, view, shouldRender);
  dynamicElement.setParent(parent);

  return dynamicElement;
}
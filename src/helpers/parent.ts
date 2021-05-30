import { DynamicElement } from "../DynamicElement";

export function parent<E extends HTMLElement>(parentElement: E, children: (HTMLElement | DynamicElement | null)[]): E {
  const currentChildren = parentElement.children;
  if (currentChildren.length > 0) return parentElement;

  children.forEach((child, index) => {
    if (!child) return;
    if (child instanceof DynamicElement) {
      child.setParent(parentElement);
      child.setIndex(index);
      child.conditionallyMount();
      return;
    }

    child.__JS_UI_STORE.position = index;
    parentElement.appendChild(child);
  });

  return parentElement;
}
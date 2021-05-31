import { DynamicElement } from "../DynamicElement";
import { evaluateProps } from '../elements';

type ParentChildren = (HTMLElement | DynamicElement)[]; 

export class ParentElement<ParentElementType extends HTMLElement = HTMLElement> {
  container: ParentElementType;
  children: ParentChildren | (() => ParentChildren);

  constructor(container: ParentElementType, children: ParentChildren | (() => ParentChildren)) {
    this.container = container;
    this.children = children;

    this.container.__JS_UI_STORE.subscribable?.onUpdate(() => {
      this.renderChildren();
    })
  }

  get activeChildren(): HTMLElement[] {
    return Array.from(this.container.children) as HTMLElement[];
  }

  renderChildren(): void {
    let children = typeof this.children == 'function' ? this.children() : this.children;

    console.log('beeb', children)

    children = children.filter((child) => {
      if (child instanceof DynamicElement) {
        child.setParent(this.container);

        return child.shouldRender();
      } else {
        return !!child;
      }
    });

    children.forEach((child, index) => {
      if (!child) return;
      if (child instanceof DynamicElement) {
        child = child.element;
      }

      const activeChildAtIndex = this.activeChildren[index];
      child.__JS_UI_STORE.position = index;

      if (activeChildAtIndex) {
        const newProps = evaluateProps(child.__JS_UI_STORE.propObjects);

        Object.assign(activeChildAtIndex, newProps);
      } else {
        this.container.appendChild(child);
      }
    });
  }
}

export function parent<E extends HTMLElement>(parentElement: E, children: ParentChildren | (() => ParentChildren)): E {
  const parent = new ParentElement(parentElement, children);

  parent.renderChildren();

  return parent.container;
}
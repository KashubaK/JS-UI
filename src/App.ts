import { View } from "./View";

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
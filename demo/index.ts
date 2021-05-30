import { App, conditional, parent, View } from '../src/index';

export type TestViewState = {
  testValue: string;
}

class TestView extends View<TestViewState> {
  constructor() {
    super({ testValue: 'yeet' });

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e: Event): void {
    const $input = e.target as HTMLInputElement;

    this.state.testValue = $input.value;
  }

  render(): HTMLDivElement {
    const { div, h1, input } = this.elements;

    const wrapper = div();
    const heading = h1(() => `Hello, ${this.state.testValue}!`);
    const testInput = input(() => ({ value: this.state.testValue, oninput: this.handleInputChange }));
    const conditionalHeading1 = conditional(
      h1('WOAH1'),
      { view: this, shouldRender: () => this.state.testValue == 'woah', parent: wrapper },
    );
    const conditionalHeading2 = conditional(
      h1('WOAH2'),
      { view: this, shouldRender: () => this.state.testValue == 'woah', parent: wrapper },
    );

    return parent(wrapper, [
      conditionalHeading2,
      heading,
      conditionalHeading1,
      testInput,
    ]);
  }
}

new App('#root', new TestView());

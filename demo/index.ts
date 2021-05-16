import { App, bound, clone, conditional, div, h1, input, label, parent, View } from '../src/index';

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
    const wrapper = div();
    const heading = bound(h1, this, () => `Hello, ${this.state.testValue}!`);
    const testInput = bound(input, this, () => ({ value: this.state.testValue, oninput: this.handleInputChange }));
    const conditionalHeading1 = conditional(
      h1('WOAH1'),
      { view: this, shouldRender: () => this.state.testValue == 'woah', parent: wrapper },
    );
    const conditionalHeading2 = conditional(
      h1('WOAH2'),
      { view: this, shouldRender: () => this.state.testValue == 'woah', parent: wrapper },
    );

    const children = [
      conditionalHeading2,
      heading,
      conditionalHeading1,
      testInput,
    ];

    return parent(wrapper, children);
  }
}

new App('#root', new TestView());

import { Entrypoint, conditional, parent, View } from '../src/index';

class TestView extends View {
  testValue = 'yeet';

  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e: Event): void {
    const $input = e.target as HTMLInputElement;

    this.testValue = $input.value;
  }

  render(): HTMLDivElement {
    const { div, h1, input } = this.elements;

    const wrapper = div();
    const heading = h1(() => `Hello, ${this.testValue}!`);
    const testInput = input(() => ({ value: this.testValue, oninput: this.handleInputChange }));
    const conditionalHeading1 = conditional(
      h1('WOAH1'),
      { view: this, shouldRender: () => this.testValue == 'woah', parent: wrapper },
    );
    const conditionalHeading2 = conditional(
      h1('WOAH2'),
      { view: this, shouldRender: () => this.testValue == 'woah', parent: wrapper },
    );

    return parent(wrapper, [
      conditionalHeading2,
      heading,
      conditionalHeading1,
      testInput,
    ]);
  }
}

new Entrypoint('#root', new TestView());

import { Entrypoint, conditional, parent, View, elements } from '../src/index';

class TestView extends View {
  state = {
    testValue: 'bar',
  };

  constructor() {
    super();

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
    const conditionalHeading1 = conditional(() => this.state.testValue == 'woah', h1('WOAH1'));
    const conditionalHeading2 = conditional(() => this.state.testValue == 'woah', h1('WOAH2'));

    return parent(wrapper, [
      conditionalHeading2,
      heading,
      conditionalHeading1,
      testInput,
    ]);
  }
}

new Entrypoint('#root', new TestView());

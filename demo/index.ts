import { Entrypoint, conditional, parent, View, elements } from '../src/index';

class TestView extends View {
  nested = {
    double: {
      testValue: 'bar',
    }
  };

  items: any[] = [];

  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddItemClick = this.handleAddItemClick.bind(this);
  }

  handleInputChange(e: Event): void {
    const $input = e.target as HTMLInputElement;

    this.nested.double.testValue = $input.value;
  }

  handleAddItemClick(): void {
    this.items.push(new Date().toISOString());
  }

  render(): HTMLDivElement {
    const { div, h1, input, ul, li, button } = this.elements;

    const wrapper = div();
    const heading = h1(() => `Hello, ${this.nested.double.testValue}!`);
    const testInput = input(() => ({ value: this.nested.double.testValue, oninput: this.handleInputChange }));
    const conditionalHeading1 = conditional(() => this.nested.double.testValue == 'woah', h1('WOAH1'));
    const conditionalHeading2 = conditional(() => this.nested.double.testValue == 'woah', h1('WOAH2'));

    const addItemButton = button('Add item', () => ({ onclick: this.handleAddItemClick }));

    const list = parent(ul(), () => [
      ...this.items.map(item => li(() => `${item}, length: ${this.items.length}`)),
    ])

    return parent(wrapper, [
      conditionalHeading2,
      heading,
      conditionalHeading1,
      addItemButton,
      testInput,
      list,
    ]);
  }
}

new Entrypoint('#root', new TestView());

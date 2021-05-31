# Views

`View` is a class provided by JS UI that enables you to create reusable, dynamic interfaces.

```ts
import { View, parent } from '@kashuab/js-ui';

class SomeView extends View {
  render() {
    // this.elements is provided by the superclass.
    const { div, h1 } = this.elements;

    return parent(
      div({ className: 'SomeView' }),
      [
        h1('Hello world!')
      ]
    )
  }
}
```
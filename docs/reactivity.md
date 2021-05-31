# Reactivity

The following view has a problem. Consider its implementation:

```ts
import { View, parent } from '@kashuab/js-ui';

class MyCoolView extends View {
  name = '';

  render() {
    const { div, h1, button } = this.elements;

    return (
      parent(div(), [
        input({ onchange: e => this.name = e.target.value }),
        h1(`Hello, ${this.name}!`),
      ]);
    )
  }
} 
```

The content for the `<h1>` would always be `"Hello, !"` even if you changed the input. **How do you make it reactive to changes?**
Remember: a view's `render` method is only called once. This means that the content would only ever be what it was when initially evaluated.

If you provide a _function_ that returns the string instead of the literal itself, that provides JS UI the ability to re-evaluate the 
value when the view updates!

The solution is to change the following line:

```ts
h1(`Hello, ${this.name}!`)
```

to:

```ts
h1(() => `Hello, ${this.name}!`)
```

## How does JS UI know when a view updates?

Upon construction of a `View`, the entire class and any nested objects are turned into [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). In a nutshell, proxies provide the ability to detect interactions with an object and perform side effects.

Members that did not exist at intialization are eventually turned into proxies automatically. This will not interfere with any of your business logic, only that it will re-evaluate functional prop arguments and apply changes to elements when necessary.

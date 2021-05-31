# This is an experimental package.

**This is not fit for production** -- it's just a side project mainly to satiate my boredom!

That being said, if you like the idea and want to try it out (and maybe contribute?) more power to you! Expect bugs.

___

# JS UI

The no-BS JavaScript front-end framework. Build a reactive UI with vanilla JS.

Reactivity is powered by the `Proxy` "class", so turn around if you need to support IE 11. 

- We don't stray from the DOM
- Small package gang (`< 2KB` gzipped)
- We encourage mutability (Use mutable objects. Just do it. Pretty please?)

## Getting started

Assuming you already have some sort of environment already set up where you can utilize ES modules:

- `yarn add @kashuab/js-ui`

Implement a basic `View`:

```js
import { View, Entrypoint } from '@kashuab/js-ui';

class App extends View {
  render() {
    const { h1 } = this.elements;

    return h1('Hello world!');
  }
}

// First parameter here is a selector to your entrypoint element
new Entrypoint('#root', new App());
```

When you load the browser you should see `<h1>Hello world!</h1>` within the `#root` element.

[Read more about views](https://github.com/KashubaK/JS-UI/blob/master/docs/views.md).

___

# Development notes

## Goals

- No dependencies
- Small bundle size
- Encourage mutability (no `setState`, no `this.set`, no _**NOTHIN**_)
- Do not impose transpilation in client source code, should be 100% implementable in vanilla JS
- Be as performant _as possible_ (duh...)
- All functionality should be relatively traceable to client source code.
  - Avoid "magic" side-effects, aside from mutation reactions.
  - Any framework logic should be explicitly implemented by the developer.

### Nice-to-haves

- Different versions should play well with each other
  - Use-case: three different plugins for a website that use different versions of JS UI

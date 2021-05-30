# Reusing elements and views

## Declaring element generators

When you use a render function, you don't need to pass some special object. Just any `Element` will do! No framework logic needed, unless of course, you need any.

Here's an example of a reusable element we'll call `counter`:

```ts
function counter(): HTMLHeadingElement {
  const element = document.createElement('h1');
  
  setInterval(() => {
    element.innerText = current++;
  }, 1000);

  return element;
}
```

We can improve this. In most cases, we'll want the ability to stop the counter.
Let's update the implementation to return a function that does just that: 

```ts
function counter(): [HTMLHeadingElement, () => void] {
  const element = document.createElement('h1');
  
  let current = 0;

  const intervalId = setInterval(() => {
    element.innerText = current++;
  }, 1000);

  return [element, () => clearInterval(intervalId)];
}
```


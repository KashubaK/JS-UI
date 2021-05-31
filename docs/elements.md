# Rendering elements

Check out these examples:

```ts
div("String literals are set as the element's innerText property.");
```

```ts
div({
  innerText: 'If you provide an object, the properties are assigned to the element.',
  style: {
    backgroundColor: 'red'
  }
});
```

```ts
div(
  'You can provide as many arguments as you like!',
  {
    style: {
      fontWeight: 'bold'
    }
  },
  {
    onclick: () => console.log('Weeeeee!')
  }
);
```

```ts
// Assuming you're inside a View...
div(
  () => `Hello there, ${this.firstName}!`,
  () => ({
    style: {
      color: this.favoriteColor
    }
  })
)
```

Suggested: [read more about reactivity](reactivity.md)
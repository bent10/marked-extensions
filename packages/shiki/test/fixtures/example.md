# Example

A [marked](https://marked.js.org/) A marked extension for [Shiki](https://shiki.style/).

## Transformers

### `transformerNotationDiff`

Use `[!code ++]` and `[!code --]` to mark added and removed lines.

For example, the following code

````md
```js
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

will be transformed to

```js
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

### `transformerNotationHighlight`

Use `[!code highlight]` to highlight a line (adding `highlighted` class).

````md
```js
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

Results in

```js
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

Alternatively, you can use the [`transformerMetaHighlight`](#transformermetahighlight) to highlight lines based on the meta string.

### `transformerNotationWordHighlight`

Use `[!code word:xxx]` to highlight a word (adding `highlighted-word` class).

````md
```js
export function foo() {
  // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

Results in

```js
export function foo() {
  // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```

You can also specify the number of occurrences to highlight, e.g. `[!code word:options:2]` will highlight the next 2 occurrences of `options`.

````md
```js
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```
````

```js
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```

### `transformerNotationFocus`

Use `[!code focus]` to focus a line (adding `focused` class).

````md
```js
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

Results in

```js
export function foo() {
  console.log('Focused') // [!code focus]
}
```

### `transformerNotationErrorLevel`

Use `[!code error]`, `[!code warning]`, to mark a line with an error level (adding `highlighted error`, `highlighted warning` class).

````md
```js
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

Results in

```js
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

### `transformerMetaHighlight`

Highlight lines based on the meta string provided on the code snippet. Requires integrations supports.

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

Results in

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

### `transformerMetaWordHighlight`

Highlight words based on the meta string provided on the code snippet. Requires integrations supports.

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
```
````

Results in

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```

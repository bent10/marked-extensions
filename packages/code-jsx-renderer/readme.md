# marked-code-jsx-renderer

A [marked](https://marked.js.org/) extension to render JSX code blocks using a custom renderer and components. This extension is especially useful when you want to incorporate React JSX code directly into your Markdown documents and control how it's rendered.

## Install

You can install the `marked-code-jsx-renderer` using npm or yarn:

```bash
npm i -D marked-code-jsx-renderer
# or
yarn add --dev marked-code-jsx-renderer
```

**⚠️ NOTE:** This extension exclusively supports server-side operations and is not compatible with web browsers.

## Usage

To use this extension, you need to incorporate it into your marked processing pipeline. Here's an example of how to do it:

Say we have the following file `example.md`:

````md
This is some code:

```jsx renderable prettier
<Nav>
  <Nav.Item>
    <Nav.Link href='/features'>Features</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link href='/pricing'>Pricing</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link href='/about'>About</Nav.Link>
  </Nav.Item>
</Nav>
```
````

**🚨 Important:** The `renderable` attribute must be specified in code fence blocks for formatting the code.

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedCodeFormat from 'marked-code-format'
import markedCodeJsxRenderer from 'marked-code-jsx-renderer'

// runner
import * as runtime from 'react/jsx-runtime'
import { Nav } from 'react-bootstrap'
import { renderToStaticMarkup } from 'react-dom/server'

const content = readFileSync('example.md', 'utf-8')

const html = await new Marked()
  .use(
    markedCodeJsxRenderer({
      ...runtime,
      components: { Nav },
      renderer: renderToStaticMarkup
    })
  )
  .use(markedCodeFormat())
  .parse(content)

console.log(html)
```

Now, running node `example.js` yields:

```html
<p>This is some code:</p>
<pre><code class="language-html">&lt;div class=&quot;nav&quot;&gt;
  &lt;div class=&quot;nav-item&quot;&gt;
    &lt;a href=&quot;/features&quot; data-rr-ui-event-key=&quot;/features&quot; class=&quot;nav-link&quot;
      &gt;Features&lt;/a
    &gt;
  &lt;/div&gt;
  &lt;div class=&quot;nav-item&quot;&gt;
    &lt;a href=&quot;pricing&quot; data-rr-ui-event-key=&quot;pricing&quot; class=&quot;nav-link&quot;
      &gt;Pricing&lt;/a
    &gt;
  &lt;/div&gt;
  &lt;div class=&quot;nav-item&quot;&gt;
    &lt;a href=&quot;about&quot; data-rr-ui-event-key=&quot;about&quot; class=&quot;nav-link&quot;&gt;About&lt;/a&gt;
  &lt;/div&gt;
&lt;/div&gt;
</code></pre>
```

> ℹ️ This extension offers support for inline options, specifically
> tailored to the `unwrap` option. With inline options, you have
> fine-grained control over the behavior of the `unwrap` feature.
>
> ````md
> ```jsx renderable="{unwrap: true}"
> // jsx code here
> ```
> ````

## Options

This extension accepts several options to customize its behavior:

### `components`

An object where keys represent component names and values are React component types. These components are used for rendering JSX code blocks.

```js
import { Alert, Button } from 'react-bootstrap'

marked.use(
  markedCodeJsxRenderer({
    components: { Alert, Button }
  })
)
```

### `Fragment`

Symbol to use for fragments. This option can be helpful if your JSX code specifically requires a particular type of Fragment.

```js
import { Fragment } from 'react/jsx-runtime'

marked.use(markedCodeJsxRenderer({ Fragment }))
```

### `jsx`

The `jsx` function to use when rendering JSX code. You can customize this function if your rendering process relies on a custom `jsx` implementation.

```js
import { jsx } from 'react/jsx-runtime'

marked.use(markedCodeJsxRenderer({ jsx }))
```

### `jsxs`

The `jsxs` function to use when rendering JSX code. Similar to `jsx`, this option allows you to customize the `jsxs` function if needed.

```js
import { jsxs } from 'react/jsx-runtime'

marked.use(markedCodeJsxRenderer({ jsxs }))
```

### `renderer`

A custom rendering function for rendering JSX code. This function should return a string. You can use this to render JSX using various methods, such as converting it to HTML or rendering it on the client-side.

```js
import { renderToStaticMarkup } from 'react-dom/server'

marked.use(markedCodeJsxRenderer({ renderer: renderToStaticMarkup }))
```

### `sanitizer`

The `sanitizer` option is an optional function that allows you to sanitize the JSX code before rendering. You can use this function to enhance security and prevent code injection.

```js
import { renderToStaticMarkup } from 'react-dom/server'
import xss from 'xss'

marked.use(markedCodeJsxRenderer({ sanitizer: customSanitizer }))

// Sanitize the JSX code using the xss library
// you can replace it with any sanitizer you want (e.g. DOMPurify)
function sanitizeJSX(jsxCode) {
  const options = {
    // Define your custom xss options here
  }

  return xss(jsxCode, options)
}
```

### `unwrap`

If `true`, the extension will not wrap the rendered code in a `codefence` element. Based on the example above, this will result in the following output:

```html
<p>This is some code:</p>
<div class="nav">
  <div class="nav-item">
    <a href="/features" data-rr-ui-event-key="/features" class="nav-link"
      >Features</a
    >
  </div>
  <div class="nav-item">
    <a href="pricing" data-rr-ui-event-key="pricing" class="nav-link"
      >Pricing</a
    >
  </div>
  <div class="nav-item">
    <a href="about" data-rr-ui-event-key="about" class="nav-link">About</a>
  </div>
</div>
```

## Related

- [marked-code-format](https://github.com/bent10/marked-extensions/tree/main/packages/code-format)
- [marked-code-preview](https://github.com/bent10/marked-extensions/tree/main/packages/code-preview)

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## License

![GitHub](https://img.shields.io/github/license/bent10/marked-extensions)

A project by [Stilearning](https://stilearning.com) &copy; 2023.

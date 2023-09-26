# marked-code-preview

A [marked](https://marked.js.org/) extension to transform code blocks within Markdown documents into code previews. It allows you to generate visually appealing code previews for your code snippets within your Markdown content. You can customize the appearance and behavior of code previews using [templates and options](#options).

## Install

You can install `marked-code-preview` using npm or yarn:

```bash
npm i marked-code-preview
# or
yarn add marked-code-preview
```

## Usage

To use this extension in your Marked processing pipeline, you need to configure your marked processor with this extension. Here's an example of how to do it:

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked code preview extension</title>
  </head>
  <body>
    <div id="content"></div>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="./node_modules/marked-code-preview/dist/index.umd.cjs"></script>
    <script>
      // 🚨 Important: The `preview` attribute must be specified in code fence blocks.
      const md = `# Example

\`\`\`html preview title="Code title"
<div class='foo'>Hello, World!</div>
\`\`\`
`

      document.getElementById('content').innerHTML = new marked.Marked()
        .use(markedCodePreview())
        .parse(md)
    </script>
  </body>
</html>
```

Now, opening the `example.html` file in your browser will result in:

```html
...
<div id="content">
  <h1>Example</h1>

  <figure class="preview">
    <figcaption>Code title</figcaption>
    <div class="preview-showcase">
      <div class="foo">Hello, World!</div>
    </div>
    <div class="preview-code">
      <pre><code class="language-html">&lt;div class='foo'&gt;Hello, World!&lt;/div&gt;
</code></pre>
    </div>
  </figure>
</div>
...
```

### Node.js

Say we have the following file `example.md`:

````md
# Example

```html preview title="Code title"
<div class="foo">Hello, World!</div>
```
````

**🚨 Important:** The `preview` attribute must be specified in code fence blocks.

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import markedCodePreview from 'marked-code-preview'

const html = marked
  .use({ gfm: true })
  .use(markedCodePreview)
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running `node example.js` yields:

```html
<h1>Example</h1>

<figure class="preview">
  <figcaption>Code title</figcaption>
  <div class="preview-showcase">
    <div class="foo">Hello, World!</div>
  </div>
  <div class="preview-code">
    <pre><code class="language-html">&lt;div class=&#39;foo&#39;&gt;Hello, World!&lt;/div&gt;
</code></pre>
  </div>
</figure>
```

## Options

This extension accepts the following options:

### `template?: string`

The code preview template to use. You can customize the preview layout using placeholders like `{preview}`, `{code}`, codefence meta data (e.g. `{title}`), and your custom [data](#data--key-string-unknown-).

The default template looks like this:

```html
<figure class="preview">
  <figcaption>{title}</figcaption>
  <div class="preview-showcase">{preview}</div>
  <div class="preview-code">{code}</div>
</figure>
```

You can customize the template according to your needs. For example:

```js
import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import markedCodePreview from 'marked-code-preview'

const customTemplate = `
<figure>
  <div class='preview-container'>
    {preview}
  </div>
  <figcaption>{title}</figcaption>
</figure>
`

const html = marked
  .use({ gfm: true })
  .use(markedCodePreview({ template: customTemplate }))
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Yields:

```html
<h1>Example</h1>

<figure>
  <div class="preview-container">
    <div class="foo">Hello, World!</div>
  </div>
  <figcaption>Code title</figcaption>
</figure>
```

### `data?: { [key: string]: unknown }`

Data to interpolate into the template. You can provide additional data to be used in the template.

### `ignoreMissing?: boolean`

By default, the extension throws a `MissingValueError` when a placeholder resolves to `undefined`. Setting this option to `true` ignores it and leaves the placeholder as is.

### `transform?: (data: { value: unknown; key: string }) => unknown`

Performs an arbitrary operation for each interpolation. You can define a custom transformation function for the interpolated values.

Default transformation:

```js
;({ value }) => value
```

## Related

- [marked-code-format](https://github.com/bent10/marked-extensions/tree/main/packages/code-format)
- [marked-code-jsx-renderer](https://github.com/bent10/marked-extensions/tree/main/packages/code-jsx-renderer)

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

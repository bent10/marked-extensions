# marked-hook-frontmatter

A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support frontmatter in Markdown documents.

Frontmatter is metadata typically found at the beginning of a Markdown file, written in [YAML](https://yaml.org/) format. This hook allows you to parse and access frontmatter data and the content separately, making it easier to work with Markdown files that contain metadata.

## Install

You can install `marked-hook-frontmatter` using npm or yarn:

```bash
npm i marked-sequential-hooks marked-hook-frontmatter
# or
yarn add marked-sequential-hooks marked-hook-frontmatter
```

## Usage

Once you've installed this hook, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked hook frontmatter</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="./node_modules/marked-sequential-hooks/dist/index.umd.cjs"></script>
    <script src="./node_modules/marked-hook-frontmatter/dist/index.umd.cjs"></script>
    <script>
      const md = `---
title: Hello, world!
author: John Doe
---

# Content

This is the main content of your Markdown file autored by **{author}**.
`

      document.getElementById('content').innerHTML = new marked.Marked()
        .use(
          markedSequentialHooks({
            markdownHooks: [markedHookFrontmatter()]
          })
        )
        .parse(md)
    </script>
  </body>
</html>
```

Now, opening the `example.html` file in your browser will result in:

```html
<!doctype html>
<html>
  <head>
    ...
    <title>Hello, world!</title>
  </head>
  <body>
    <div id="content">
      <h1>Content</h1>
      <p>
        This is the main content of your Markdown file autored by
        <strong>John Doe</strong>.
      </p>
    </div>

    ...
  </body>
</html>
```

### Node.js

Say we have the following file `example.md`:

```md
---
title: Hello, world!
author: John Doe
---

# Content

This is the main content of your Markdown file autored by **{page.author}**.
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedFrontmatter from 'marked-hook-frontmatter'

const markdown = readFileSync('example.md', 'utf8')
const html = new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [markedHookFrontmatter({ dataPrefix: 'page' })]
    })
  )
  .parse(markdown)

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Content</h1>
<p>
  This is the main content of your Markdown file autored by
  <strong>John Doe</strong>.
</p>
```

## Options

### `dataPrefix?: boolean | string`

The prefix to use for hooks data when adding frontmatter data. If `true`, the data will be added to the `matter` property of the hooks data. If a string is provided, the data will be added with that string as the key.

```js
new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [markedHookFrontmatter({ dataPrefix: true })],
      htmlHooks: [
        (html, data) => {
          console.log(data.matter) // yields: { foo: 'bar' }

          return html
        }
      ]
    })
  )
  .parse('---\nfoo: bar\n---\nHello, {matter.foo}!')
```

### `schema?: Schema`

Specifies a `Schema` to use:

- [`FAILSAFE_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2802346) - only strings, arrays and plain objects
- [`JSON_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2803231) - all JSON-supported types
- [`CORE_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2804923) - same as `JSON_SCHEMA`
- `DEFAULT_SCHEMA` - all supported YAML types.

### `json?: boolean`

Compatibility with `JSON.parse` behavior. If `true`, it indicates compatibility with JSON parsing.

## Related

- [marked-sequential-hooks](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks)
- [marked-hook-data](https://github.com/bent10/marked-extensions/tree/main/packages/hook-data)
- [marked-hook-layout](https://github.com/bent10/marked-extensions/tree/main/packages/hook-layout)

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

# marked-sequential-hooks

A [marked](https://marked.js.org/) extension that enables the sequential preprocessing and post-processing of Markdown content. This extension allows you to apply a series of transformations to Markdown or HTML content before or after it is processed.

## Install

You can install `marked-sequential-hooks` using npm or yarn:

```bash
npm i marked-sequential-hooks
# or
yarn add marked-sequential-hooks
```

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

### Node.js

Say we have the following file `example.md`:

```md
---
title: Hello, world!
author: John Doe
---

# Content

This is the main content of your Markdown file autored by **{author}**.
```

And our module `example.js` looks as follows:

```ts
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedSequentialHooks, {
  type HtmlHook,
  type MarkdownHook
} from 'marked-sequential-hooks'
import frontmatter from 'marked-hook-frontmatter'

const myHook: MarkdownHook = (markdown, data) => {
  // now we can access data from frontmatter
  console.log(data)
  // yields: {title: 'Hello, world!', author: 'John Doe'}

  return markdown
}

const layoutHook: HtmlHook = (html, data) => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
  </head>

  <body>
    ${html}
  </body>
</html>
`
}

const html = new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [frontmatter(), myHook],
      htmlHooks: [layoutHook]
    })
  )
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello, world!</title>
  </head>

  <body>
    <h1>Content</h1>
    <p>
      This is the main content of your Markdown file autored by
      <strong>John Doe</strong>.
    </p>
  </body>
</html>
```

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked sequential hooks</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-sequential-hooks/dist/index.umd.js"></script>
    <script>
      ;(async () => {
        const md = '# {title}\n\n{body}\n'

        const myAsyncHook = async (markdown, data) => {
          const res = await fetch('https://dummyjson.com/posts/2')

          Object.assign(data, await res.json())

          return markdown
        }

        document.getElementById('content').innerHTML = await new marked.Marked({
          async: true
        })
          .use(
            markedSequentialHooks({
              markdownHooks: [
                myAsyncHook,
                (markdown, data) => {
                  document.title = data.id

                  return markdown
                    .replace('{title}', data.title)
                    .replace('{body}', data.body)
                }
              ]
            })
          )
          .parse(md)
      })()
    </script>
  </body>
</html>
```

## Options

The `marked-sequential-hooks` extension accepts the following configuration options:

### `markdownHooks?: MarkdownHook[]`

An array of functions to preprocess Markdown content before parsing with marked. Here is an example of how to create a Markdown hook function:

```ts
import type { MarkdownHook } from 'marked-sequential-hooks'

/**
 * Represents a Markdown hook function.
 *
 * @param markdown - The Markdown string from the prev MarkdownHook.
 * @param data - The extended Hooks data object.
 * @returns The transformed Markdown string.
 */
const myHook: MarkdownHook = (markdown, data) => {
  // do something with markdown

  return markdown
}
```

Optionally, you can also pass an options object to your hook function:

```ts
import type { MarkdownHook } from 'marked-sequential-hooks'

function myHook(options = {}): MarkdownHook {
  const { foo, bar } = options

  return (markdown, data) => {
    // do something with markdown

    return markdown
  }
}
```

### `htmlHooks?: HtmlHook[]`

An array of functions to post-process HTML content after parsing with marked. Here is an example of how to create an HTML hook:

```ts
import type { HtmlHook } from 'marked-sequential-hooks'

/**
 * Represents an HTML hook function.
 *
 * @param html - The HTML string from the prev HtmlHook.
 * @param data - The extended Hooks data object.
 * @returns The transformed HTML string.
 */
const myHook: HtmlHook = (html, data) => {
  // do something with html

  return html
}
```

Optionally, you can also pass an options object to your hook function:

```ts
import type { HtmlHook } from 'marked-sequential-hooks'

function myHook(options = {}): HtmlHook {
  const { foo, bar } = options

  return (html, data) => {
    // do something with html

    return html
  }
}
```

## Related

- [marked-hook-data](https://github.com/bent10/marked-extensions/tree/main/packages/hook-data)
- [marked-hook-frontmatter](https://github.com/bent10/marked-extensions/tree/main/packages/hook-frontmatter)
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

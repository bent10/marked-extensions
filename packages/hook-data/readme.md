# marked-hook-data

A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to load data from files or objects and attach it to the marked hooks context. This hook allows you to enrich your Markdown processing by including external data seamlessly.

## Install

You can install `marked-hook-data` using npm or yarn:

```bash
npm i marked-sequential-hooks marked-hook-data
# or
yarn add marked-sequential-hooks marked-hook-data
```

## Usage

Once you've installed this hook, you can use it in your marked configuration. Here's an example of how to configure it:

### Node.js

Say we have the following file `example.md`:

```md
---
layout: 'single-post'
datasource: './posts.json'
---

# {title}

{body}
```

The file `posts.json` would look something like:

```json
[
  {
    "title": "My First Post",
    "body": "Hello World!"
  },
  {
    "title": "My Second Post",
    "body": "Hello Again!"
  },
  {
    "title": "My Third Post",
    "body": "Hello Again and Again!"
  }
]
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookData from 'marked-hook-data'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import pupa from 'pupa'

const template = readFileSync('example.md', 'utf8')

new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [markedHookFrontmatter(), markedHookData()],
      htmlHooks: [
        (html, data) => {
          for (const post of data.posts) {
            const filename =
              post.title.toLowerCase().replace(/[^\w-]+/g, '-') + '.html'
            const content = pupa(html, post)

            console.log('filename:', filename)
            console.log(content)
            console.log('=====\n')
          }

          return html
        }
      ]
    })
  )
  .parse(template)
```

Now, running node `example.js` yields:

```bash
filename: my-first-post.html
<h1>My First Post</h1>
<p>Hello World!</p>

=====

filename: my-second-post.html
<h1>My Second Post</h1>
<p>Hello Again!</p>

=====

filename: my-third-post.html
<h1>My Third Post</h1>
<p>Hello Again and Again!</p>

=====
```

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked hook data</title>
  </head>
  <body>
    <h1>My Posts</h1>
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-sequential-hooks/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-hook-data/dist/index.umd.min.js"></script>
    <script>
      ;(async () => {
        const res = await fetch('https://dummyjson.com/posts?limit=10')
        const dataPosts = await res.json()

        document.getElementById('content').innerHTML = await new marked.Marked({
          async: true
        })
          .use(
            markedSequentialHooks({
              markdownHooks: [
                markedHookData(dataPosts),
                (markdown, { posts = [] }) => {
                  const chunk = []

                  for (const { title, body } of posts) {
                    chunk.push(
                      markdown.replace('{title}', title).replace('{body}', body)
                    )
                  }

                  return chunk.join('\n')
                }
              ]
            })
          )
          .parse('## {title}\n\n{body}\n\n---\n')
      })()
    </script>
  </body>
</html>
```

[![Try marked-hook-data on RunKit](https://badge.runkitcdn.com/example.html.svg)](https://untitled-z1hmnmfs79ol.runkit.sh/)

## Function

### `markedHookData(source: string | string[] | { [key: string]: any }): MarkdownHook`

- `source`: A string or array of string specifying file patterns or an object containing data.
- Returns: A `MarkdownHook` function that processes the Markdown and attaches hooks data.

## Loading Data from Files

`marked-hook-data` allows you to load data from files and attach it to the hooks context.

### Loading Data from Files by File Patterns

To load data from files based on file patterns, provide a string argument with the file patterns:

```js
// work well witn async option
marked.use({ async: true }).use(markedHookData('data/*.json'))
```

This example will load all JSON files in the `data` directory and attach their content to the hooks context.

### Loading Data from Specific Files

To load data from specific files, provide the file paths directly in an array:

```js
marked.use(markedHookData(['data/file1.json', 'data/file2.yaml']))
```

This example will load data from `file1.json` and `file2.yaml` and attach it to the hooks context.

### Supported File Types

`marked-hook-data` supports loading the following file types:

- `.yaml` and `.yml`
- `.json`
- `.js`, `.mjs`, and `.cjs` – ESM files are only supported when the `async` option is set to `true`.

## Loading Data from Objects

You can also directly provide an object:

```js
const externalData = {
  greeting: 'Hello, World!',
  author: 'John Doe'
}

marked.use(markedHookData(externalData))
```

This object will be attached to the hooks context.

## Related

- [marked-sequential-hooks](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks)
- [marked-hook-frontmatter](https://github.com/bent10/marked-extensions/tree/main/packages/hook-frontmatter)
- [marked-hook-handlebars](https://github.com/bent10/marked-extensions/tree/main/packages/hook-handlebars)
- [marked-hook-layout](https://github.com/bent10/marked-extensions/tree/main/packages/hook-layout)
- [loadee](https://github.com/bent10/loadee)

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

# marked-hook-handlebars

A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support [Handlebars](https://handlebarsjs.com/) in Markdown documents.

## Install

You can install `marked-hook-handlebars` using npm or yarn:

```bash
npm i marked-sequential-hooks marked-hook-handlebars
# or
yarn add marked-sequential-hooks marked-hook-handlebars
```

## Usage

Once you've installed this hook, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked hook handlebars</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/moo/moo.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-sequential-hooks/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-hook-frontmatter/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-hook-handlebars/dist/index.umd.min.js"></script>
    <script>
      const md = `---
title: Hello, world!
author: John Doe
---

# {{title}}

This is the main content of your Markdown file autored by **{{author}}**.
`

      document.getElementById('content').innerHTML = new marked.Marked()
        .use(
          markedSequentialHooks({
            markdownHooks: [markedHookFrontmatter()],
            htmlHooks: [markedHookHandlebars()]
          })
        )
        .parse(md)
    </script>
  </body>
</html>
```

[![Try marked-hook-handlebars on RunKit](https://badge.runkitcdn.com/example.html.svg)](https://untitled-6wderuoisrou.runkit.sh/)

### Node.js

```js
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import markedHookHandlebars from 'marked-hook-handlebars'

const markdown = `---
title: Hello, world!
author: John Doe
---

# {{page.title}}

This is the main content of your Markdown file autored by **{{page.author}}**.
`

const html = new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [markedHookFrontmatter({ dataPrefix: 'page' })],
      htmlHooks: [markedHookHandlebars()]
    })
  )
  .parse(markdown)

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Hello, world!</h1>
<p>
  This is the main content of your Markdown file autored by
  <strong>John Doe</strong>.
</p>
```

## Options

Please refer to the [Handlebars runtime options](https://handlebarsjs.com/api-reference/runtime-options.html).

## Related

- [marked-sequential-hooks](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks)
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

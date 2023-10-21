# marked-hook-ejs

A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support [EJS](https://ejs.co) in Markdown documents.

## Install

You can install `marked-hook-ejs` using npm or yarn:

```bash
npm i marked-sequential-hooks marked-hook-ejs
# or
yarn add marked-sequential-hooks marked-hook-ejs
```

## Usage

Once you've installed this hook, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked hook EJS</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/moo/moo.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ejs/ejs.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-sequential-hooks/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-hook-frontmatter/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked-hook-ejs/dist/index.umd.min.js"></script>
    <script>
      const md = `---
title: Hello, world!
author: John Doe
---

# {%= title %}

This is the main content of your Markdown file autored by **{%= author %}**.
`

      document.getElementById('content').innerHTML = new marked.Marked()
        .use(
          markedSequentialHooks({
            markdownHooks: [markedHookFrontmatter()],
            htmlHooks: [
              markedHookEjs(null, {
                openDelimiter: '{',
                closeDelimiter: '}'
              })
            ]
          })
        )
        .parse(md)
    </script>
  </body>
</html>
```

> Marked escapes the `<` character during the rendering process, which can
> lead to compatibility issues with EJS when you put it in the
> `htmlHooks`. To overcome this challenge, consider implementing custom
> delimiters to ensure that EJS functions properly without any unexpected
> character escapes. This approach will help maintain the integrity of
> your templates and ensure smooth interactions between Marked and EJS.

[![Try marked-hook-ejs on RunKit](https://badge.runkitcdn.com/example.html.svg)](https://untitled-h9m76kcd1a9c.runkit.sh/)

### Node.js

```js
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import markedHookEjs from 'marked-hook-ejs'

const markdown = `---
title: Hello, world!
author: John Doe
---

# <%= page.title %>

This is the main content of your Markdown file autored by **<%= page.author %>**.
`

const html = new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [
        markedHookFrontmatter({ dataPrefix: 'page' }),
        markedHookEjs()
      ]
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

Please refer to the [EJS docs](https://ejs.co/#docs).

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

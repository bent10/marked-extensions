# marked-hook-layout

A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked that handles layouts.

## Install

You can install `marked-hook-layout` using npm or yarn:

```bash
npm i marked-sequential-hooks marked-hook-layout
# or
yarn add marked-sequential-hooks marked-hook-layout
```

## Usage

Once you've installed this hook, you can use it in your marked configuration. Here's an example of how to configure it:

Say we have the following file `example.md`:

```md
---
layout: simple
title: Marked hook layout
author: John Doe
---

# {{matter.title}}

This is the main content of your Markdown file autored by **{{matter.author}}** at **{{date}}**
```

The `layouts/simple.html` look like:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{matter.title}}</title>
  </head>
  <body>
    <Outlet />
  </body>
</html>
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookData from 'marked-hook-data'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import markedHookLayout from 'marked-hook-layout'

const md = readFileSync('example.md', 'utf8')

const html = new Marked()
  .use(
    markedSequentialHooks({
      markdownHooks: [
        markedHookData({ date: new Date('2023-09-30').toDateString() }),
        markedHookFrontmatter({ dataPrefix: true })
      ],
      htmlHooks: [markedHookLayout()]
    })
  )
  .parse(md)

console.log(html)
```

Now, running node `example.js` yields:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Marked hook layout</title>
  </head>
  <body>
    <h1>Marked hook layout</h1>
    <p>
      This is the main content of your Markdown file autored by
      <strong>John Doe</strong> at <strong>Sat Sep 30 2023</strong>.
    </p>
  </body>
</html>
```

## Options

The `marked-hook-layout` function accepts the following configuration options:

- `dir` (optional): The directory where layout templates are stored. Defaults to `'layouts'`.

- `name` (optional): The name of the layout to use, it can be specified with or without the `.html` suffix. Defaults to `'default'`.

- `placeholder` (optional): The placeholder to replace in the layout content. You can provide a string or a regular expression. Defaults to `/<Outlet[ \t]*?\/>/`.

## Related

- [marked-sequential-hooks](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks)
- [marked-hook-data](https://github.com/bent10/marked-extensions/tree/main/packages/hook-data)
- [marked-hook-frontmatter](https://github.com/bent10/marked-extensions/tree/main/packages/hook-frontmatter)

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

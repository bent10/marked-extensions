# marked-directive

A [marked](https://marked.js.org/) extension to support [directives syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444).

## Install

You can install `marked-directive` using npm or yarn:

```bash
npm i marked-directive
# or
yarn add marked-directive
```

## Usage

[![Try marked-directive on RunKit](https://badge.runkitcdn.com/marked-directive.svg)](https://untitled-zniiqipcb1b2.runkit.sh/)

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

Say we have the following file `example.md`:

```md
# Example

:::main{#foo .bar class="baz" .qux}

[Directives syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444)

::hr{.border-muted}

You can use :i[CSS] (Cascading Style Sheets) to style your :abbr[HTML]{title="HyperText Markup Language"}.

:::
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import { createDirectives } from 'marked-directive'

const html = new Marked()
  .use(createDirectives())
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Example</h1>
<main id="foo" class="bar baz qux">
  <p>
    <a
      href="https://talk.commonmark.org/t/generic-directives-plugins-syntax/444"
      >Directives syntax</a
    >
  </p>
  <hr class="border-muted" />
  <p>
    You can use <i>CSS</i> (Cascading Style Sheets) to style your
    <abbr title="HyperText Markup Language">HTML</abbr>.
  </p>
</main>
```

## Custom Directives

The `marked-directive` extension accepts a set of custom configurations for your directives. You can specify how the directives are identified, how they should be rendered, and other behavior. The options include:

- `level`: The level of the directive, which can be `'container'`, `'block'`, or `'inline'`. This determines where the directive can be used.
- `marker`: The marker string that identifies the directive in the source text.
- `tag`: An optional HTML tag that the directive should be rendered as. If not provided, the default tag is used based on the directive level.
- `renderer`: A custom rendering function for the directive. This function can be used to customize how the directive is rendered.

Here's an example of custom options:

Say we have the following markdown code:

```md
Custom directives:

::youtube[Dummy video]{vid="9xwazD5SyVg"}

1. @bent10
2. #markdown
3. :emoji[rocket]{title="Go!"}

And whatever is on your mind 🤯.
```

```ts
import { Marked } from 'marked'
import {
  createDirectives,
  presetDirectiveConfigs,
  type DirectiveConfig
} from 'marked-directive'

// defines `:youtube` directive
const youtubeDirective: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer(token) {
    if (token.meta.name === 'youtube') {
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${
        token.attrs?.vid || ''
      }" title="${
        token.text
      }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    }

    return false
  }
}

// defines `@mention` directive
const mentionDirective: DirectiveConfig = {
  level: 'inline',
  marker: '@',
  renderer(token) {
    return `<a class="user-mention notranslate" href="/users/${token.meta.name}">${token.meta.name}</a>`
  }
}

// defines `#hashtag` directive
const hashtagDirective: DirectiveConfig = {
  level: 'inline',
  marker: '#',
  renderer(token) {
    return `<a class="hashtag" href="/tags/${token.meta.name}">${token.meta.name}</a>`
  }
}

// defines `:emoji` directive
const emojis = { rocket: '🚀', 'red-exclamation': '❗' } // mock emoji api
const emojiDirective: DirectiveConfig = {
  level: 'inline',
  marker: ':',
  renderer(token) {
    if (token.meta.name === 'emoji') {
      return `<span ${token.attrs?.toString()}>${emojis[token.text]}</span>`
    }

    return false
  }
}

const html = new Marked()
  .use(
    createDirectives([
      ...presetDirectiveConfigs,
      youtubeDirective,
      mentionDirective,
      hashtagDirective,
      emojiDirective
    ])
  )
  .parse(md)

console.log(html)
```

[![Try marked-directive on RunKit](https://badge.runkitcdn.com/marked-directive.svg)](https://untitled-owlc7cxj7jxp.runkit.sh/)

## Related

See [extensions list](https://github.com/bent10/marked-extensions/edit/main/readme.md#packages).

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

A project by [Stilearning](https://stilearning.com) &copy; 2023-2024.

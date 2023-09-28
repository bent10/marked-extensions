# marked-code-format

A [marked](https://marked.js.org/) extension for formatting code blocks using [Prettier](https://prettier.io/).

## Install

You can install `marked-code-format` using npm or yarn:

```bash
npm i marked-code-format
# or
yarn add marked-code-format
```

**Note:** Be sure to install the `prettier` package as well.

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Marked code format extension</title>
  </head>
  <body>
    <div id="content"></div>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://unpkg.com/prettier@3.0.3/standalone.js"></script>
    <script src="https://unpkg.com/prettier@3.0.3/plugins/graphql.js"></script>
    <script src="./node_modules/marked-code-format/dist/index.umd.cjs"></script>
    <script>
      ;(async () => {
        const md = `# Example

\`\`\`graphql prettier
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) { name friends @include(if: $withFriends) { name } }
}
\`\`\`
`

        document.getElementById('content').innerHTML = await new marked.Marked()
          .use(markedCodeFormat({ plugins: prettierPlugins }))
          .parse(md)
      })()
    </script>
  </body>
</html>
```

Now, opening the `example.html` file in your browser will result in:

```html
...
<div id="content">
  <h1>Example</h1>
  <pre><code class="language-graphql">query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
</code></pre>
</div>
...
```

### Node.js

Say we have the following file `example.md`:

````md
# Example

```html prettier
<div><p>Greetings, traveler! Sign up today!</p></div>
```
````

**🚨 Important:** The `prettier` attribute must be specified in code fence blocks for formatting the code.

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedCodeFormat from 'marked-code-format'

const html = new Marked()
  .use(
    markedCodeFormat({
      /* Prettier options */
    })
  )
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

````html
<h1>Example</h1>

```html
<div>
  <p>Greetings, traveler! Sign up today!</p>
</div>
```
````

## Inline Options

Prettier configuration can be specified in code fence blocks using the `prettier` attribute, it has a higher priority than extension `Options`. For example:

````md
```ts prettier="{ parser: 'typescript' }"
// your code here
```
````

## Related

- [marked-code-jsx-renderer](https://github.com/bent10/marked-extensions/tree/main/packages/code-jsx-renderer)
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

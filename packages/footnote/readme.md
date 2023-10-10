# marked-footnote

A [marked](https://marked.js.org/) extension to support [GFM footnotes](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes).

- [Install](#install)
- [Usage](#usage)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Options](#options)
- [Limitations](#limitations)
- [Related](#related)
- [Contributing](#contributing)
- [License](#license)

## Install

You can install `marked-footnote` using npm or yarn:

```bash
npm i marked-footnote
# or
yarn add marked-footnote
```

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

Say we have the following file `example.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Marked Footnote</title>

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css"
      integrity="sha512-bm684OXnsiNuQSyrxuuwo4PHqr3OzxPpXyhT66DA/fhl73e1JmBxRKGnO/nRwWvOZxJLRCmNH7FII+Yn1JNPmg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />

    <style>
      #content {
        margin: 0 auto;
        padding: 1rem;
        max-width: 928px;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        word-wrap: normal;
        border: 0;
      }
    </style>
  </head>

  <body class="markdown-body">
    <div id="content"></div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="./dist/index.umd.cjs"></script>
    <script>
      const md = `# Example

[^1]: This is a footnote content.

Here is a simple footnote[^1]. With some additional text after it[^@#$%] and without disrupting the blocks[^bignote].

[^bignote]: The first paragraph of the definition.

    Paragraph two of the definition.

    > A blockquote with
    > multiple lines.

    \`\`\`
    a code block
    \`\`\`

    | Header 1 | Header 2 |
    | -------- | -------- |
    | Cell 1   | Cell 2   |

    A \`final\` paragraph before list.

    - Item 1
    - Item 2
      - Subitem 1
      - Subitem 2

[^@#$%]: A footnote on the label: "@#$%".
`

      document.getElementById('content').innerHTML = new marked.Marked()
        .use(markedFootnote())
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
  <p>
    Here is a simple footnote<sup
      ><a
        id="footnote-ref-1"
        href="#footnote-1"
        data-footnote-ref=""
        aria-describedby="footnote-label"
        >1</a
      ></sup
    >. With some additional text after it<sup
      ><a
        id="footnote-ref-%40%23%24%25"
        href="#footnote-%40%23%24%25"
        data-footnote-ref=""
        aria-describedby="footnote-label"
        >@#$%</a
      ></sup
    >
    and without disrupting the blocks<sup
      ><a
        id="footnote-ref-bignote"
        href="#footnote-bignote"
        data-footnote-ref=""
        aria-describedby="footnote-label"
        >bignote</a
      ></sup
    >.
  </p>
  <section class="footnotes" data-footnotes="">
    <h2 id="footnote-label" class="sr-only" dir="auto">Footnotes</h2>
    <ol>
      <li id="footnote-1">
        <p>
          This is a footnote content.
          <a
            href="#footnote-ref-1"
            data-footnote-backref=""
            aria-label="Back to reference 1"
            >↩</a
          >
        </p>
      </li>
      <li id="footnote-bignote">
        <p>The first paragraph of the definition.</p>
        <p>Paragraph two of the definition.</p>
        <blockquote>
          <p>A blockquote with multiple lines.</p>
        </blockquote>
        <pre><code>a code block
</code></pre>
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell 1</td>
              <td>Cell 2</td>
            </tr>
          </tbody>
        </table>
        <p>A <code>final</code> paragraph before list.</p>
        <ul>
          <li>Item 1</li>
          <li>
            Item 2
            <ul>
              <li>Subitem 1</li>
              <li>Subitem 2</li>
            </ul>
          </li>
        </ul>
        <p>
          <a
            href="#footnote-ref-bignote"
            data-footnote-backref=""
            aria-label="Back to reference bignote"
            >↩</a
          >
        </p>
      </li>
      <li id="footnote-%40%23%24%25">
        <p>
          A footnote on the label: "@#$%".
          <a
            href="#footnote-ref-%40%23%24%25"
            data-footnote-backref=""
            aria-label="Back to reference @#$%"
            >↩</a
          >
        </p>
      </li>
    </ol>
  </section>
</div>
...
```

### Node.js

Say we have the following file `example.md`:

````md
# Example

[^1]: This is a footnote content.

Here is a simple footnote[^1]. With some additional text after it[^@#$%] and without disrupting the blocks[^bignote].

[^bignote]: The first paragraph of the definition.

    Paragraph two of the definition.

    > A blockquote with
    > multiple lines.

    ```
    a code block
    ```

    | Header 1 | Header 2 |
    | -------- | -------- |
    | Cell 1   | Cell 2   |

    A `final` paragraph before list.

    - Item 1
    - Item 2
      - Subitem 1
      - Subitem 2

[^@#$%]: A footnote on the label: "@#$%".
````

> **Note:** The position of a footnote in your Markdown does not influence
> where the footnote will be rendered. You can write a footnote right
> after your reference to the footnote, and the footnote will still render
> at the bottom of the Markdown.

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedFootnote from 'marked-footnote'

const html = new Marked()
  .use(markedFootnote())
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Example</h1>
<p>
  Here is a simple footnote<sup
    ><a
      id="footnote-ref-1"
      href="#footnote-1"
      data-footnote-ref
      aria-describedby="footnote-label"
      >1</a
    ></sup
  >. With some additional text after it<sup
    ><a
      id="footnote-ref-%40%23%24%25"
      href="#footnote-%40%23%24%25"
      data-footnote-ref
      aria-describedby="footnote-label"
      >@#$%</a
    ></sup
  >
  and without disrupting the blocks<sup
    ><a
      id="footnote-ref-bignote"
      href="#footnote-bignote"
      data-footnote-ref
      aria-describedby="footnote-label"
      >bignote</a
    ></sup
  >.
</p>
<section class="footnotes" data-footnotes>
  <h2 id="footnote-label" class="sr-only" dir="auto">Footnotes</h2>
  <ol>
    <li id="footnote-1">
      <p>
        This is a footnote content.
        <a
          href="#footnote-ref-1"
          data-footnote-backref
          aria-label="Back to reference 1"
          >↩</a
        >
      </p>
    </li>
    <li id="footnote-bignote">
      <p>The first paragraph of the definition.</p>
      <p>Paragraph two of the definition.</p>
      <blockquote>
        <p>A blockquote with multiple lines.</p>
      </blockquote>
      <pre><code>a code block
</code></pre>
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
      <p>A <code>final</code> paragraph before list.</p>
      <ul>
        <li>Item 1</li>
        <li>
          Item 2
          <ul>
            <li>Subitem 1</li>
            <li>Subitem 2</li>
          </ul>
        </li>
      </ul>
      <p>
        <a
          href="#footnote-ref-bignote"
          data-footnote-backref
          aria-label="Back to reference bignote"
          >↩</a
        >
      </p>
    </li>
    <li id="footnote-%40%23%24%25">
      <p>
        A footnote on the label: &quot;@#$%&quot;.
        <a
          href="#footnote-ref-%40%23%24%25"
          data-footnote-backref
          aria-label="Back to reference @#$%"
          >↩</a
        >
      </p>
    </li>
  </ol>
</section>
```

By default, this plugin does not place footnote markers in square brackets (`[1]`), instead like this: `1`. So you will need to add the style as shown below to your CSS:

```css
[data-footnote-ref]::before {
  content: '[';
}

[data-footnote-ref]::after {
  content: ']';
}
```

## Options

The marked-footnote extension accepts the following configuration options:

- `prefixId`: The prefix ID for footnotes. Defaults to `'footnote-'`.

- `description`: The description of footnotes, used by `aria-labeledby` attribute. Defaults to `'Footnotes'`.

- `refMarkers`: If set to `true`, it will place footnote reference in square brackets, like this: `[1]`. Defaults to `false`.

## Limitations

When considering the use of footnotes in your content, it's important to keep in mind the following accessibility and usability factors:

1. **Screen Reader Compatibility**: Screen readers may not effectively convey footnotes. They tend to read the footnote number without indicating that it's a footnote or using superscript. Additionally, they may not identify the link to the footnote text.
2. **Accessibility Challenges**: Footnotes pose challenges for all users on a web page. To access them, one often needs to scroll to the end of the page, read the footnote, and then click back to the main content. Not everyone is aware that they should click on the footnote at the end, potentially causing them to lose their place. Moreover, if the same footnote is repeated multiple times, clicking on the link could lead to the wrong location.

If you find it necessary to utilize footnotes, here are some best practices to follow:

- **Numeric Format**: Use numbers for your footnotes rather than typographical symbols or special characters.
- **Square Bracket Markers**: Place footnote markers in square brackets, like this: `[1]`.
- **Avoid Superscript**: Do not use superscript formatting for your footnote markers.

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

A project by [Stilearning](https://stilearning.com) &copy; 2023.

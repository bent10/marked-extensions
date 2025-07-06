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
    <script src="https://cdn.jsdelivr.net/npm/marked-footnote/dist/index.umd.min.js"></script>
    <script>
      const md = `# Example

[^1]: This is a footnote content.

Here is a simple footnote[^1]. With some additional text after it[^@#$%] and without disrupting the blocks[^bignote].

[^bignote]: The first paragraph of the definition.

    Paragraph two of the definition.

    > A blockquote with
    > multiple lines.

    ~~~
    a code block
    ~~~

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

[![Try marked-footnote on RunKit](https://badge.runkitcdn.com/example.html.svg)](https://untitled-0x6rqd9q0jep.runkit.sh/)

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
      >2</a
    ></sup
  >
  and without disrupting the blocks<sup
    ><a
      id="footnote-ref-bignote"
      href="#footnote-bignote"
      data-footnote-ref
      aria-describedby="footnote-label"
      >3</a
    ></sup
  >.
</p>
<section class="footnotes" data-footnotes>
  <h2 id="footnote-label" class="sr-only">Footnotes</h2>
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
      <a
        href="#footnote-ref-bignote"
        data-footnote-backref
        aria-label="Back to reference bignote"
        >↩</a
      >
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

- `prefixData`: The prefix for the main data attribute for footnotes. Defaults to `''`, an empty string, making the attribute equal `data-footnotes`.

- `description`: The description of footnotes, used by `aria-labeledby` attribute. Defaults to `'Footnotes'`.

- `refMarkers`: If set to `true`, it will place footnote reference in square brackets, like this: `[1]`. Defaults to `false`.

- `footnoteDivider`: If set to `true`, it will insert a horizontal rule above the footnotes at the bottom of the page. Defaults to `false`.

- `keepLabels`: If set to `true`, it will keep the original labels of footnote references in the generated HTML output. If not, the references will be labelled by numbers starting with 1 and incremented by 1 from left to right, top to down. Defaults to `false`.

- `sectionClass`: The CSS class set to the element wrapping all footnotes at the bottom of the page. Can be set to an empty string to remove the CSS class. Defaults to `'footnotes'`.

- `headingClass`: The CSS class set to the heading element introducing the footnotes at the bottom of the page for screen reader users. Can be set to an empty string to remove the CSS class. Defaults to `'sr-only'`.

- `backRefLabel`: ARIA label of the links referring back to the location in the text of the page where the footnote has been referred from. Defaults to `'Back to reference {0}'`. The placeholder `{0}` will be replaced by the footnote marker text.

## Limitations

When considering the use of footnotes in your content, it's important to keep in mind the following accessibility and usability factors:

1. **Screen Reader Compatibility**: Screen readers may not effectively convey footnotes. They tend to read the footnote number without indicating that it's a footnote or using superscript. Additionally, they may not identify the link to the footnote text.
2. **Accessibility Challenges**: Footnotes pose challenges for all users on a web page. To access them, one often needs to scroll to the end of the page, read the footnote, and then click back to the main content. Not everyone is aware that they should click on the footnote at the end, potentially causing them to lose their place. Moreover, if the same footnote is repeated multiple times, clicking on the link could lead to the wrong location.

## Related

See [extensions list](https://github.com/bent10/marked-extensions#packages).

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

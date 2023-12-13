/// <reference types="vitest/globals" />

import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import markedFootnote from '../src/index.js'

it('should handle no footnotes in the input Markdown', () => {
  const md = 'This is a sentence without any footnotes.'
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence without any footnotes.</p>
    "
  `)
})

it('should handle custom options', () => {
  const md = `
This is a sentence with custom options footnote[^1].

[^1]: Content of the footnote.
`
  const html = marked
    .use(
      markedFootnote({
        prefixId: 'fn-',
        description: 'My footnotes',
        refMarkers: true
      })
    )
    .parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with custom options footnote<sup><a id=\\"fn-ref-1\\" href=\\"#fn-1\\" data-fn-ref aria-describedby=\\"fn-label\\">[1]</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"fn-label\\" class=\\"sr-only\\">My footnotes</h2>
    <ol>
    <li id=\\"fn-1\\">
    <p>Content of the footnote. <a href=\\"#fn-ref-1\\" data-fn-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle empty footnote content', () => {
  const md = `
This is a sentence with an empty footnote[^1].

[^1]:
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with an empty footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
     <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should ignore ref without footnote', () => {
  const md = `
This is a sentence[^2] with an empty footnote[^1].

[^1]: foo <https://example.com>
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence[^2] with an empty footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>foo <a href=\\"https://example.com\\">https://example.com</a> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should ignore unused footnote', () => {
  const md = `
This is a sentence with an empty footnote[^1].

[^1]: foo <https://example.com>
[^2]: bar [Foo](https://example.com)
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with an empty footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>foo <a href=\\"https://example.com\\">https://example.com</a> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should reset refs number on each parsing', () => {
  const md = `
This is a sentence with an empty footnote[^1].

[^1]: foo <https://example.com>
`
  const engine = marked.use(markedFootnote())
  const result1 = engine.parse(md)
  const result2 = engine.parse(md)

  expect(result1).toMatchInlineSnapshot(`
    "<p>This is a sentence with an empty footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>foo <a href=\\"https://example.com\\">https://example.com</a> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
  expect(result2).toMatch(result1)
})

it('should handle footnote content with link', () => {
  const md = `
This is a sentence[^2] with an empty footnote[^1].

[^1]: foo <https://example.com>
[^2]: bar [Foo](https://example.com)
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence<sup><a id=\\"footnote-ref-2\\" href=\\"#footnote-2\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup> with an empty footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">2</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-2\\">
    <p>bar <a href=\\"https://example.com\\">Foo</a> <a href=\\"#footnote-ref-2\\" data-footnote-backref aria-label=\\"Back to reference 2\\">↩</a></p>
    </li>
    <li id=\\"footnote-1\\">
    <p>foo <a href=\\"https://example.com\\">https://example.com</a> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiple references to the same footnote', () => {
  const md = `
This is a sentence with multiple references to the same footnote[^1][^1].

[^1]: Content of the common footnote.
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with multiple references to the same footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup><sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1:2</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>Content of the common footnote. <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩<sup>2</sup></a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiline footnote with plain text', () => {
  const md = `
This is a sentence with a multiline footnote[^1].

[^1]: This is the first line of the footnote,
    This is the second line of the footnote.

    This is a new paragraph for the same footnote.
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with a multiline footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>This is the first line of the footnote,
    This is the second line of the footnote.</p>
    <p>This is a new paragraph for the same footnote. <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiline footnote with lists', () => {
  const md = `
This is a sentence with a multiline footnote containing a list[^1].

[^1]: - Item 1
    - Item 2
      - Subitem 1
      - Subitem 2
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with a multiline footnote containing a list<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <ul>
    <li>Item 1</li>
    <li>Item 2<ul>
    <li>Subitem 1</li>
    <li>Subitem 2</li>
    </ul>
    </li>
    </ul> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiline footnote with blockquote', () => {
  const md = `
This is a sentence with a multiline footnote containing a blockquote[^1].

[^1]: > This is a blockquote in the footnote.
     > Another line in the blockquote.
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with a multiline footnote containing a blockquote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <blockquote>
    <p>This is a blockquote in the footnote.
    Another line in the blockquote.</p>
    </blockquote> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiline footnote with code fence', () => {
  const md = `
This is a sentence with a multiline footnote containing a code fence[^1].

[^1]: ~~~javascript
    // This is a code fence in the footnote
    const x = 1;
    ~~~
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with a multiline footnote containing a code fence<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <pre><code class=\\"language-javascript\\">// This is a code fence in the footnote
    const x = 1;
    </code></pre> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle multiline footnote with table', () => {
  const md = `
This is a sentence with a multiline footnote containing a table[^1].

[^1]: | Header 1 | Header 2 |
    | -------- | -------- |
    | Cell 1   | Cell 2   |
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with a multiline footnote containing a table<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <table>
    <thead>
    <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    </tr>
    </thead>
    <tbody><tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    </tr>
    </tbody></table> <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should not parse a multiline footnote with less than 4 spaces', () => {
  const md = `
This is a sentence with an invalid multiline footnote[^1].

[^1]: This is a single-line footnote.
   I begin with 3-spaces only.
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is a sentence with an invalid multiline footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <p>   I begin with 3-spaces only.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>This is a single-line footnote. <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should render multiline footnotes at the end of the file', () => {
  const md = `
This is the beginning of the file[^1].

This is some content in the middle of the file.

[^1]: This is a multiline footnote at the end of the file.
    It can be placed anywhere, but it should always appear at the end.

This is more content in the middle of the file.

[^2]: Another multiline footnote at the end of the file.
    This is also placed somewhere in the middle of the content.

This is the end of the file[^2].
`
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<p>This is the beginning of the file<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>.</p>
    <p>This is some content in the middle of the file.</p>
    <p>This is more content in the middle of the file.</p>
    <p>This is the end of the file<sup><a id=\\"footnote-ref-2\\" href=\\"#footnote-2\\" data-footnote-ref aria-describedby=\\"footnote-label\\">2</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>This is a multiline footnote at the end of the file.
    It can be placed anywhere, but it should always appear at the end. <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    <li id=\\"footnote-2\\">
    <p>Another multiline footnote at the end of the file.
    This is also placed somewhere in the middle of the content. <a href=\\"#footnote-ref-2\\" data-footnote-backref aria-label=\\"Back to reference 2\\">↩</a></p>
    </li>
    </ol>
    </section>
    "
  `)
})

it('should handle complex content within footnotes', () => {
  const md = readFileSync('./test/fixtures/example.md', 'utf8')
  const html = marked.use(markedFootnote()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<h1>Example</h1>
    <p>Here is a simple footnote<sup><a id=\\"footnote-ref-1\\" href=\\"#footnote-1\\" data-footnote-ref aria-describedby=\\"footnote-label\\">1</a></sup>. With some additional text after it<sup><a id=\\"footnote-ref-%40%23%24%25\\" href=\\"#footnote-%40%23%24%25\\" data-footnote-ref aria-describedby=\\"footnote-label\\">2</a></sup> and without disrupting the blocks<sup><a id=\\"footnote-ref-bignote\\" href=\\"#footnote-bignote\\" data-footnote-ref aria-describedby=\\"footnote-label\\">3</a></sup>.</p>
    <section class=\\"footnotes\\" data-footnotes>
    <h2 id=\\"footnote-label\\" class=\\"sr-only\\">Footnotes</h2>
    <ol>
    <li id=\\"footnote-1\\">
    <p>This is a footnote content. <a href=\\"#footnote-ref-1\\" data-footnote-backref aria-label=\\"Back to reference 1\\">↩</a></p>
    </li>
    <li id=\\"footnote-%40%23%24%25\\">
    <p>A footnote on the label: &quot;@#$%&quot;. <a href=\\"#footnote-ref-%40%23%24%25\\" data-footnote-backref aria-label=\\"Back to reference @#$%\\">↩</a></p>
    </li>
    <li id=\\"footnote-bignote\\">
    <p>The first paragraph of the definition.</p>
    <p>Paragraph two of the definition.</p>
    <blockquote>
    <p>A blockquote with
    multiple lines.</p>
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
    <tbody><tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    </tr>
    </tbody></table>
    <p>A <code>final</code> paragraph before list.</p>
    <ul>
    <li>Item 1</li>
    <li>Item 2<ul>
    <li>Subitem 1</li>
    <li>Subitem 2</li>
    </ul>
    </li>
    </ul> <a href=\\"#footnote-ref-bignote\\" data-footnote-backref aria-label=\\"Back to reference bignote\\">↩</a>
    </li>
    </ol>
    </section>
    "
  `)
})

/// <reference types="vitest/globals" />

import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import markedPlaintify from '../src/index.js'

it('should convert Markdown content to plain text', () => {
  const md = readFileSync('test/fixtures/base.md', 'utf8')
  const plaintext = marked.use({ gfm: true }, markedPlaintify()).parse(md)

  expect(plaintext).toMatchInlineSnapshot(`
    "Heading 1

    This is a paragraph.


    Item 1
    Item 2

    Alt text

    Link text

    Column 1: Cell 1
    Column 2: Cell 2

    "
  `)
})

it('should handle complex Markdown content', () => {
  const md = readFileSync('test/fixtures/complex.md', 'utf8')
  const plaintext = marked.use({ gfm: true }, markedPlaintify()).parse(md)

  expect(plaintext).toMatchInlineSnapshot(`
    "GitHub Flavored Markdown (GFM) Specifications Demo

    This document showcases various features and specifications of GitHub Flavored Markdown (GFM).

    1. Headings

    This is a third-level heading

    This is a fourth-level heading

    2. Emphasis

    This text will be italic
    This will also be italic

    This text will be bold
    This will also be bold

    3. Lists

    Unordered List


    Item 1
    Item 2
    Item 2a
    Item 2b

    Ordered List


    First item
    Second item
    Third item
    Indented item
    Indented item

    4. Links

    Github - Renders as a link to GitHub.

    5. Images

    GitHub Logo

    6. Blockquotes

    This is a blockquote

    7. Inline code

    This is an inline code example.

    8. Code blocks

    function greet(name) {
      console.log(&#39;Hello, &#39; + name + &#39;!&#39;)
    }

    greet(&#39;World&#39;)

    9. Strikethrough

    This text is strikethrough.

    10. Tables

    Column 1: Cell 1
    Column 2: Cell 2
    Column 3: Cell 3

    Column 1: Cell 4
    Column 2: Cell 5
    Column 3: Cell 6

    11. Task lists


    Task 1
    Task 2
    Task 3

    12. Mentioning users and issues

    @username, #123

    13. Emoji

    :smile:, :rocket:, :octocat:

    14. Automatic linking for URLs

    https://www.google.com

    15. Strikethrough

    Strikethrough

    16. Ignoring Markdown formatting

    *This will not be italic*

    17. Tables

    Markdown: Still
    Less: renders
    Pretty: nicely

    Markdown: 1
    Less: 2
    Pretty: 3

    18. Fenced code blocks with language syntax highlighting

    def hello():
        print(&quot;Hello, World!&quot;)

    19. Disabling line breaks in paragraphs

    This is a paragraph that demonstrates how to
    disable line breaks.

    20. Automatic linking for URLs

    www.example.com

    "
  `)
})

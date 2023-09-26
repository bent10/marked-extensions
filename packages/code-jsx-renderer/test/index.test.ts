/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import markedCodeJsxRenderer from '../src/index.js'

it('should render JSX code block with custom renderer', () => {
  const content = '```jsx renderable\n<div>Hello, World!</div>;\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-html">&lt;div&gt;Hello, World!&lt;/div&gt;
</code></pre>
`)
})

it('should handle sanitizer function', () => {
  const content =
    '```javascriptreact renderable\n<script>alert("Hello!");</script>;\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup,
        sanitizer(code: string) {
          /// match <script> tags
          const scriptTagRegex =
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi

          return code.replace(scriptTagRegex, match => {
            // return the sanitized code as a jsx element
            return `<div key='0' dangerouslySetInnerHTML={{ __html: '&lt;${match.slice(
              1
            )}' }} />`
          })
        }
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-html">&lt;div&gt;&amp;lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;&lt;/div&gt;
</code></pre>
`)
})

it('should unwrap the code block when "unwrap" option is true', () => {
  const content = '```react renderable\n<div>Hello, World!</div>\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup,
        unwrap: true
      })
    )
    .parse(content)

  expect(html).toBe('<div>Hello, World!</div>')
})

it('should handle inline `unwrap` option', () => {
  const content =
    '```react renderable="{unwrap: true, jsx: \'ignored\'}"\n<Foo>Hello, World!</Foo>\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        components: {
          Foo: ({ children }: { children?: string }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (runtime as any).jsx('div', { children })
        },
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html).toBe('<div>Hello, World!</div>')
})

it('should ignore empty code', () => {
  const content = '``` renderable\n\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html).toBe('<pre><code class="language-renderable">\n</code></pre>\n')
})

it('should not modify unsupported code block languages', () => {
  const content = '```unsupported-language renderable\nconst x = 1\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-unsupported-language">const x = 1
</code></pre>
`)
})

it('should handle formatting failures and preserve the original code block', () => {
  // invalid JSX code to trigger a formatting failure
  const content = '```jsx renderable\n<div>Missing closing tag\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  // expect the code block to remain unchanged due to the formatting failure
  expect(html)
    .toBe(`<pre><code class="language-jsx">&lt;div&gt;Missing closing tag
</code></pre>
`)
})

it('should call errorHandler if an error occurs during transformation', () => {
  const content = '```jsx renderable\n<div>Missing closing tag\n```\n'

  expect(() =>
    new Marked()
      .use(
        markedCodeJsxRenderer({
          ...runtime,
          renderer: renderToStaticMarkup,
          errorHandler(e) {
            throw e
          }
        })
      )
      .parse(content)
  ).toThrowError()
})

it('should not render JSX code block without `renderable` attribute', () => {
  const content = '```jsx\n<div>Hello, World!</div>;\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-jsx">&lt;div&gt;Hello, World!&lt;/div&gt;;
</code></pre>
`)
})

it('should not render JSX code block without `jsx` runner', () => {
  const content = '```jsx renderable\n<div>Hello, World!</div>;\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        renderer: renderToStaticMarkup
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-jsx">&lt;div&gt;Hello, World!&lt;/div&gt;;
</code></pre>
`)
})

it('should not render JSX code block without `renderer`', () => {
  const content = '```jsx renderable\n<div>Hello, World!</div>;\n```\n'
  const html = new Marked()
    .use(
      markedCodeJsxRenderer({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(runtime as any)
      })
    )
    .parse(content)

  expect(html)
    .toBe(`<pre><code class="language-jsx">&lt;div&gt;Hello, World!&lt;/div&gt;;
</code></pre>
`)
})

it('should not be accessible to subsequent extensions.', () => {
  const content = '```jsx renderable\n<div>Hello, World!</div>;\n```\n'

  new Marked()
    .use({ gfm: true })
    .use(
      markedCodeJsxRenderer({
        ...runtime,
        renderer: renderToStaticMarkup
      })
    )
    .use({
      extensions: [
        {
          name: 'code',
          renderer(token) {
            expect(token.lang).not.toMatch(/renderable/)

            return false
          }
        }
      ]
    })
    .parse(content)
})

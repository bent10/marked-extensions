/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedCodePreview from '../src/index.js'

const md = `# Example

\`\`\`html preview title="Code title"
<div class='foo'>Hello, World!</div>
\`\`\`
`

it('should transform code blocks into code previews', () => {
  const html = new Marked()
    .use({ gfm: true })
    .use(markedCodePreview())
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should use a custom template when provided in options', () => {
  const template = `
<figure>
  <div class='preview-container'>
    {preview}
  </div>
  <figcaption>{title}</figcaption>
</figure>
`

  const html = new Marked()
    .use({ gfm: true })
    .use(markedCodePreview({ template }))
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should have access to the hooks data', () => {
  const html = new Marked()
    .use({ gfm: true })
    .use({
      hooks: {
        preprocess(markdown) {
          this.data = { foo: 'bar' }
          return markdown
        },
        postprocess(html) {
          return html
        }
      }
    })
    .use(markedCodePreview({ template: '{foo}' }))
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should not transform code blocks that do not have `preview` attribute', () => {
  const md = `
\`\`\`jsx
<Foo />
\`\`\`
`

  const html = new Marked()
    .use({ gfm: true })
    .use(markedCodePreview())
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should not be accessible to subsequent extensions.', () => {
  new Marked()
    .use({ gfm: true })
    .use(markedCodePreview())
    .use({
      extensions: [
        {
          name: 'code',
          renderer(token) {
            expect(token.lang).not.toMatch(/preview/)

            return false
          }
        }
      ]
    })
    .parse(md)
})

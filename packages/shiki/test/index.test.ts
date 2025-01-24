/// <reference types="vitest/globals" />

import { readFile } from 'node:fs/promises'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight
} from '@shikijs/transformers'
import markedShiki from '../src/index.js'

const [highlighter, example, tsContent] = await Promise.all([
  createHighlighter({
    langs: ['md', 'ts', 'js'],
    themes: ['github-dark-dimmed']
  }),
  readFile('./test/fixtures/example.md', 'utf8'),
  readFile('./test/fixtures/example.ts', 'utf8')
])

const exampleTs = `\n~~~ts\n${tsContent}\n~~~\n`

it('should correctly highlight code blocks', async () => {
  const html = await new Marked().use(markedShiki()).parse(exampleTs)

  expect(html).toMatchSnapshot()
})

it('should correctly highlight code blocks with shiki', async () => {
  const html = await new Marked()
    .use(
      markedShiki({
        highlight(code, lang) {
          return highlighter.codeToHtml(code, {
            lang,
            theme: 'github-dark-dimmed'
          })
        }
      })
    )
    .parse(exampleTs)

  expect(html).toMatchSnapshot()
})

it('should correctly highlight code blocks with custom container', async () => {
  const html = await new Marked()
    .use(
      markedShiki({
        container: `<div class="foo">
<div class="bar">%t</div>
<div class="baz">%s</div>
<div class="qux">%l</div>
</div>`,
        async highlight(code, lang) {
          return highlighter.codeToHtml(code, {
            lang,
            theme: 'github-dark-dimmed'
          })
        }
      })
    )
    .parse(exampleTs)

  expect(html).toMatchSnapshot()
})

it('should handle errors thrown by the highlight function', async () => {
  await expect(() =>
    new Marked()
      .use(
        markedShiki({
          async highlight() {
            throw new Error('Highlighting error')
          }
        })
      )
      .parse(exampleTs)
  ).rejects.toThrowError('Highlighting error')
})

it('should handle complex content', async () => {
  const html = await new Marked()
    .use(
      markedShiki({
        async highlight(code, lang, props) {
          return highlighter.codeToHtml(code, {
            lang,
            theme: 'github-dark-dimmed',
            meta: { __raw: props.join(' ') },
            transformers: [
              transformerNotationDiff({
                matchAlgorithm: 'v3'
              }),
              transformerNotationHighlight({
                matchAlgorithm: 'v3'
              }),
              transformerNotationWordHighlight({
                matchAlgorithm: 'v3'
              }),
              transformerNotationFocus({
                matchAlgorithm: 'v3'
              }),
              transformerNotationErrorLevel({
                matchAlgorithm: 'v3'
              }),
              transformerMetaHighlight(),
              transformerMetaWordHighlight()
            ]
          })
        }
      })
    )
    .parse(example)

  expect(html).toMatchSnapshot()
})

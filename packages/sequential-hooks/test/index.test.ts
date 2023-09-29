/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedSequentialHooks, { HtmlHook, MarkdownHook } from '../src/index.js'
import { markdownHookAsync, layoutHook, htmlHookAsync } from './helpers.js'

it('should return a MarkedExtension object with preprocess and postprocess hooks', () => {
  const extension = markedSequentialHooks()
  expect(extension).toHaveProperty('hooks')
  expect(extension.hooks).toHaveProperty('preprocess')
  expect(extension.hooks).toHaveProperty('postprocess')
})

it('should apply preprocess markdownHooks sequentially', () => {
  const markdownHooks: MarkdownHook[] = [
    markdown => markdown.toUpperCase(),
    markdown => markdown.replace('HELLO', 'WORLD')
  ]
  const extension = markedSequentialHooks({ markdownHooks })
  const inputMarkdown = 'Hello, Markdown!'
  const transformedMarkdown = extension.hooks?.preprocess(inputMarkdown)
  expect(transformedMarkdown).toEqual('WORLD, MARKDOWN!')
})

it('should apply postprocess htmlHooks sequentially', () => {
  const htmlHooks: HtmlHook[] = [
    html => html.toUpperCase(),
    html => html.replace('WORLD', 'HELLO')
  ]
  const extension = markedSequentialHooks({ htmlHooks })
  const inputHtml = '<div>Hello, World!</div>'
  const transformedHtml = extension.hooks?.postprocess(inputHtml)
  expect(transformedHtml).toEqual('<DIV>HELLO, HELLO!</DIV>')
})

it('should apply markdownHooks and htmlHooks in sequence', () => {
  const md = `# Content

This is the main content of your Markdown file autored by **{author}**.
`

  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [
          (markdown, data) => {
            Object.assign(data, { title: 'Hello, world!', author: 'John Doe' })
            return markdown
          },
          (markdown, data) => {
            expect(data).toEqual({ title: 'Hello, world!', author: 'John Doe' })

            return markdown.replace(/{author}/, String(data.author))
          }
        ],
        htmlHooks: [layoutHook]
      })
    )
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should support async hooks', async () => {
  await new Marked({ async: true })
    .use(
      markedSequentialHooks({
        markdownHooks: [
          markdownHookAsync,
          (markdown, data) => {
            expect(data).toEqual({ foo: 'bar' })
            return markdown
          }
        ],
        htmlHooks: [
          htmlHookAsync,
          (html, data) => {
            expect(data).toEqual({ foo: 'bar', baz: true })

            return html
          }
        ]
      })
    )
    .parse('test async')
})

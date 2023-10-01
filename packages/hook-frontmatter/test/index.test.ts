/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookFrontmatter from '../src/index.js'

it('should parse frontmatter and add it to the extended hook data property', () => {
  const md = '---\nfoo: bar\nbaz: qux\n---\nSome content'
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter()],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              foo: 'bar',
              baz: 'qux',
              matterDataPrefix: false
            })

            return html
          }
        ]
      })
    )
    .parse(md)

  expect(html).toBe('<p>Some content</p>\n')
})

it('should replace placeholders in the content with data from the extended hook', () => {
  const md = '---\nfoo: bar\n---\nHello, {foo}!'
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter()],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({ foo: 'bar', matterDataPrefix: false })

            return html
          }
        ]
      })
    )
    .parse(md)

  expect(html).toBe('<p>Hello, bar!</p>\n')
})

it('should add frontmatter to the extended hook data property with a custom dataPrefix', () => {
  const md = '---\nfoo: bar\n---\nHello, {page.foo}!'
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter({ dataPrefix: 'page' })],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              page: { foo: 'bar' },
              matterDataPrefix: 'page'
            })

            return html
          }
        ]
      })
    )
    .parse(md)

  expect(html).toBe('<p>Hello, bar!</p>\n')
})

it('should use `matter` as dataPrefix when the option set to true', () => {
  const md = '---\nfoo: bar\n---\nHello, { matter.foo}!'
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter({ dataPrefix: true })],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              matter: { foo: 'bar' },
              matterDataPrefix: 'matter'
            })

            return html
          }
        ]
      })
    )
    .parse(md)

  expect(html).toBe('<p>Hello, bar!</p>\n')
})

it('should support spaces nor tabs inside placehholder', () => {
  const md = '---\nfoo: bar\n---\nHello, {   matter.foo  }!'
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter({ dataPrefix: true })],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              matter: { foo: 'bar' },
              matterDataPrefix: 'matter'
            })

            return html
          }
        ]
      })
    )
    .parse(md)

  expect(html).toBe('<p>Hello, bar!</p>\n')
})

it('should closed with double lines', () => {
  const html = new Marked({ gfm: true })
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter()]
      })
    )
    .parse('---\nfoo: bar\n\n---\n# Content\n')

  expect(html).toBe('<hr>\n<h1>Content</h1>\n')
})

it('should pass the filename option when available in data', () => {
  const md = '---\nfoo: bar\nfoo: baz\n---\nContent'

  expect(() =>
    new Marked()
      .use(
        markedSequentialHooks({
          markdownHooks: [
            (markdown, data) => {
              Object.assign(data, { filename: 'test.md' })
              return markdown
            },
            markedHookFrontmatter()
          ]
        })
      )
      .parse(md)
  ).toThrow(/test\.md/)
})

it('should ends `closeTag` with newline', () => {
  expect(() =>
    new Marked()
      .use(
        markedSequentialHooks({
          markdownHooks: [markedHookFrontmatter()]
        })
      )
      .parse('---\nfoo: bar\n------\n')
  ).toThrow(/can not read a block mapping entry/)
})

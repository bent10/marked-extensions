/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import markedHookEjs from '../src/index.js'

it('should render ejs template in Markdown', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [
          (md, data) => {
            Object.assign(data, { name: 'John' })
            return md
          },
          markedHookEjs()
        ]
      })
    )
    .parse('Hello, <%= name %>!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, John!</p>
    "
  `)
})

it('should handle additional ejs options', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookEjs({ name: 'John' })]
      })
    )
    .parse('Hello, <%= name %>!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, John!</p>
    "
  `)
})

it('should handle complex ejs templates', () => {
  const context = { user: { name: 'Alice', age: 30 } }
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookEjs(context)]
      })
    )
    .parse('Name: <%= user.name %>, Age: <%= user.age %>')

  expect(html).toMatchInlineSnapshot(`
    "<p>Name: Alice, Age: 30</p>
    "
  `)
})

it('should handle frontmatter ejs templates', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter(), markedHookEjs()]
      })
    )
    .parse(
      '---\nuser:\n  name: Alice\n  age: 30\n---\n\nName: <%= user.name %>, Age: <%= user.age %>'
    )

  expect(html).toMatchInlineSnapshot(`
    "<p>Name: Alice, Age: 30</p>
    "
  `)
})

it('should throw missing data in the ejs template', () => {
  expect(() =>
    new Marked()
      .use(
        markedSequentialHooks({
          markdownHooks: [markedHookEjs({ foo: 'bar' })]
        })
      )
      .parse('Hello, <%= name ?? "" %>!')
  ).toThrowError(/name is not defined/)
})

it('should gracefully handle missing data in the ejs template', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookEjs({ foo: 'bar' })]
      })
    )
    .parse('Hello, <%= locals?.name %>!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, !</p>
    "
  `)
})

it('should resolve compatibility issues', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        htmlHooks: [
          markedHookEjs(
            { name: 'John' },
            {
              openDelimiter: '{',
              closeDelimiter: '}'
            }
          )
        ]
      })
    )
    .parse('Hello, {%= name %}!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, John!</p>
    "
  `)
})

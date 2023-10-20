/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookFrontmatter from 'marked-hook-frontmatter'
import markedHookHandlebars from '../src/index.js'

it('should render Handlebars template in Markdown', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [
          (md, data) => {
            Object.assign(data, { name: 'John' })
            return md
          }
        ],
        htmlHooks: [markedHookHandlebars()]
      })
    )
    .parse('Hello, {{name}}!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, John!</p>
    "
  `)
})

it('should handle additional Handlebars options', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        htmlHooks: [markedHookHandlebars({ data: { name: 'John' } })]
      })
    )
    .parse('Hello, {{name}}!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, John!</p>
    "
  `)
})

it('should handle complex Handlebars templates', () => {
  const data = { user: { name: 'Alice', age: 30 } }
  const html = new Marked()
    .use(
      markedSequentialHooks({
        htmlHooks: [markedHookHandlebars({ data })]
      })
    )
    .parse('Name: {{user.name}}, Age: {{user.age}}')

  expect(html).toMatchInlineSnapshot(`
    "<p>Name: Alice, Age: 30</p>
    "
  `)
})

it('should handle frontmatter Handlebars templates', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter()],
        htmlHooks: [markedHookHandlebars()]
      })
    )
    .parse(
      '---\nuser:\n  name: Alice\n  age: 30\n---\n\nName: {{user.name}}, Age: {{user.age}}'
    )

  expect(html).toMatchInlineSnapshot(`
    "<p>Name: Alice, Age: 30</p>
    "
  `)
})

it('should gracefully handle missing data in the Handlebars template', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        htmlHooks: [markedHookHandlebars()]
      })
    )
    .parse('Hello, {{name}}!')

  expect(html).toMatchInlineSnapshot(`
    "<p>Hello, !</p>
    "
  `)
})

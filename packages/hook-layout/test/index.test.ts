/// <reference types="vitest/globals" />

import fs, { promises as fsp } from 'node:fs'
import { default as path } from 'node:path'
import { Marked } from 'marked'
import markedSequentialHooks, {
  type MarkdownHook
} from 'marked-sequential-hooks'
import pupa from 'pupa'
import markedHookLayout from '../src/index.js'

const md = fs.readFileSync('./test/fixtures/example.md', 'utf8')

afterEach(() => {
  vi.clearAllMocks()
})

it('should apply layout with default options', () => {
  vi.spyOn(String.prototype, 'replace').mockImplementationOnce(arg =>
    String(arg)
  )
  vi.spyOn(fs, 'readFileSync').mockImplementationOnce(arg => String(arg))
  vi.spyOn(path, 'join').mockImplementationOnce((...args: string[]) =>
    String(args)
  )

  const layoutHook = markedHookLayout({ placeholder: '_r_' })
  layoutHook('content', {}, false)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(String.prototype.replace).toHaveBeenCalledTimes(1)
  expect(String.prototype.replace).toHaveBeenLastCalledWith('_r_', 'content')
  expect(path.join).toHaveBeenCalledTimes(1)
  expect(path.join).toHaveBeenCalledWith('layouts', 'default.html')
})

it('should apply layout with custom options', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        htmlHooks: [
          markedHookLayout({ dir: 'test/fixtures', name: 'foo.html' })
        ]
      })
    )
    .parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{matter.title}</title>
      </head>
      <body>
        <h1>Content</h1>
    <p>This is the main content of your Markdown file autored by <strong>John Doe</strong> at <strong>Sep 2023</strong>.</p>

      </body>
    </html>
    "
  `)
})

it('should apply layout with async option', async () => {
  vi.spyOn(fsp, 'readFile')

  const html = await new Marked({ async: true })
    .use(
      markedSequentialHooks({
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures', name: 'foo' })]
      })
    )
    .parse(md)

  expect(fsp.readFile).toHaveBeenCalledOnce()
  expect(html).toMatchInlineSnapshot(`
    "<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{matter.title}</title>
      </head>
      <body>
        <h1>Content</h1>
    <p>This is the main content of your Markdown file autored by <strong>John Doe</strong> at <strong>Sep 2023</strong>.</p>

      </body>
    </html>
    "
  `)
})

it('should work well with frontmatter hook', () => {
  const mockFrontmatterHook: MarkdownHook = (html, data) => {
    Object.assign(data, {
      matterDataPrefix: 'matter',
      matter: {
        layout: 'foo',
        title: 'Marked hook layout',
        author: 'John Doe',
        date: 'Sep 2023'
      }
    })

    return html
  }

  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockFrontmatterHook],
        htmlHooks: [
          markedHookLayout({ dir: 'test/fixtures' }),
          (html, data) => pupa(html, data, { ignoreMissing: true })
        ]
      })
    )
    .parse('# {matter.title}\n\nBy {matter.author} on {matter.date}')

  expect(html).toMatchInlineSnapshot(`
    "<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Marked hook layout</title>
      </head>
      <body>
        <h1>Marked hook layout</h1>
    <p>By John Doe on Sep 2023</p>

      </body>
    </html>
    "
  `)
})

it('should work well with data and frontmatter hook', () => {
  const mockFrontmatterHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      matterDataPrefix: false,
      layout: 'bar',
      title: 'Marked hook layout',
      author: 'John Doe'
    })

    return markdown
  }
  const mockDataHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      date: 'Sep 2023'
    })

    return markdown
  }

  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockDataHook, mockFrontmatterHook],
        htmlHooks: [
          markedHookLayout({ dir: 'test/fixtures' }),
          (html, data) => pupa(html, data, { ignoreMissing: true })
        ]
      })
    )
    .parse('# {title}\n\nBy {author} on {date}')

  expect(html).toMatchInlineSnapshot(`
    "<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Marked hook layout</title>
      </head>
      <body>
        <h1>Marked hook layout</h1>
    <p>By John Doe on Sep 2023</p>

      </body>
    </html>
    "
  `)
})

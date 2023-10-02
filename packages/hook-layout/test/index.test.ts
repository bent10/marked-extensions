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
  expect(String.prototype.replace).toHaveBeenCalledTimes(2)
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
    .parse(md.replace(/\-{3}[^-]+\-{3}\n/, ''))

  expect(html).toMatchSnapshot()
})

it('should apply layout with async option', async () => {
  vi.spyOn(fsp, 'readFile')

  const html = await new Marked({ async: true })
    .use(
      markedSequentialHooks({
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures', name: 'foo' })]
      })
    )
    .parse(md.replace(/\-{3}[^-]+\-{3}\n/, ''))

  expect(fsp.readFile).toHaveBeenCalledOnce()
  expect(html).toMatchSnapshot()
})

it('should work well with frontmatter hook', () => {
  const mockFrontmatterHook: MarkdownHook = (html, data) => {
    Object.assign(data, {
      matterDataPrefix: 'matter',
      matter: { layout: 'foo', title: 'Marked hook layout', author: 'John Doe' }
    })

    return html
  }

  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockFrontmatterHook],
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures' })]
      })
    )
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should work well with data and frontmatter hook', () => {
  const mockFrontmatterHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      matterDataPrefix: false,
      layout: 'foo',
      title: 'Marked hook layout',
      author: 'John Doe'
    })

    return markdown
  }
  const mockDataHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      date: new Date('2023-09-30').toDateString()
    })

    return pupa(markdown, data, { ignoreMissing: true })
  }

  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockFrontmatterHook, mockDataHook],
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures' })]
      })
    )
    .parse(md)

  expect(html).toMatchSnapshot()
})

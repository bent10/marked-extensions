/// <reference types="vitest/globals" />

import fs, { promises as fsp } from 'node:fs'
import { default as path } from 'node:path'
import { Marked } from 'marked'
import markedSequentialHooks from 'marked-sequential-hooks'
import markedHookData from 'marked-hook-data'
import markedHookFrontmatter from 'marked-hook-frontmatter'
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
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookFrontmatter({ dataPrefix: true })],
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures' })]
      })
    )
    .parse(md)

  expect(html).toMatchSnapshot()
})

it('should work well with data and frontmatter hook', () => {
  const html = new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [
          markedHookData({ date: new Date('2023-09-30').toDateString() }),
          markedHookFrontmatter()
        ],
        htmlHooks: [markedHookLayout({ dir: 'test/fixtures' })]
      })
    )
    .parse(md)

  expect(html).toMatchSnapshot()
})

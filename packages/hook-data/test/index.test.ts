/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedSequentialHooks, {
  type MarkdownHook
} from 'marked-sequential-hooks'
import markedHookData from '../src/index.js'
import posts from './fixtures/posts.json'

it('should return the original markdown when source is undefined', () => {
  const markdownHook = markedHookData()
  const result = markdownHook('foo', {}, false)
  expect(result).toEqual('foo')
})

it('should return the original markdown when source is an empty object', () => {
  const markdownHook = markedHookData({})
  const result = markdownHook('foo', {}, false)
  expect(result).toEqual('foo')
})

it('should load data from files and attach it to the context', () => {
  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookData('./test/fixtures/**/*')],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              nested: { foo: { abc: 'baz', qux: true }, bar: { qux: false } },
              posts,
              datasourcesAncestor: 'test/fixtures',
              datasources: [
                'test/fixtures/nested.json',
                'test/fixtures/posts.json',
                'test/fixtures/nested/bar.cjs',
                'test/fixtures/nested/foo.yml'
              ]
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should load data from files and attach it to the context without merging', () => {
  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookData('./test/fixtures/**/*', false)],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              nested: { foo: { qux: true }, bar: { qux: false } },
              posts,
              datasourcesAncestor: 'test/fixtures',
              datasources: [
                'test/fixtures/nested.json',
                'test/fixtures/posts.json',
                'test/fixtures/nested/bar.cjs',
                'test/fixtures/nested/foo.yml'
              ]
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should load data from files and attach it to the context asynchronously', async () => {
  await new Marked({ async: true })
    .use(
      markedSequentialHooks({
        markdownHooks: [
          markedHookData('./test/fixtures/**/*'),
          async (md, data) => {
            for (const key in data) {
              if (data[key] instanceof Promise) {
                data[key] = await data[key]
              }
            }

            return md
          }
        ],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              nested: { foo: { abc: 'baz', qux: true }, bar: { qux: false } },
              posts,
              datasourcesAncestor: 'test/fixtures',
              datasources: [
                'test/fixtures/nested.json',
                'test/fixtures/posts.json',
                'test/fixtures/nested/bar.cjs',
                'test/fixtures/nested/foo.yml'
              ]
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should load data from an object and attach it to the context', () => {
  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookData({ foo: 'bar', baz: true })],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              foo: 'bar',
              baz: true
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should handle array input as specific sources', () => {
  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [
          markedHookData(['./test/fixtures/posts.json', './no-exist/file.json'])
        ],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              datasources: ['test/fixtures/posts.json'],
              datasourcesAncestor: 'test/fixtures',
              posts
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should handle array input types and attach them as "unknown" key', () => {
  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [markedHookData(['foo', 1 as unknown as string])],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({
              unknown: ['foo', 1]
            })

            return html
          }
        ]
      })
    )
    .parse('# content')
})

it('should use datasource from matter data if provided', () => {
  const mockFrontmatterHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      matterDataPrefix: false,
      datasource: './test/fixtures/posts.json'
    })

    return markdown
  }

  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockFrontmatterHook, markedHookData()],
        htmlHooks: [
          (html, data) => {
            expect(data.posts).toEqual(posts)

            return html
          }
        ]
      })
    )
    .parse('---\ndatasource: "./test/fixtures/posts.json"\n---\n')
})

it('should use datasource from matter data with prefix if provided', () => {
  const mockFrontmatterHook: MarkdownHook = (markdown, data) => {
    Object.assign(data, {
      matterDataPrefix: 'matter',
      matter: { datasource: './test/fixtures/posts.json' }
    })

    return markdown
  }

  new Marked()
    .use(
      markedSequentialHooks({
        markdownHooks: [mockFrontmatterHook, markedHookData()],
        htmlHooks: [
          (html, data) => {
            expect(data.posts).toEqual(posts)

            return html
          }
        ]
      })
    )
    .parse('---\ndatasource: "./test/fixtures/posts.json"\n---\n')
})

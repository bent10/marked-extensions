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
        markdownHooks: [markedHookData('./test/fixtures/*.json')],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({ posts })

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
        markdownHooks: [markedHookData('./test/fixtures/*.json')],
        htmlHooks: [
          async (html, data) => {
            expect(await data.posts).toEqual(posts)

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
            expect(data).toEqual({ foo: 'bar', baz: true })

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
          markedHookData(['./test/fixtures/*.json', './no-exist/file.json'])
        ],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({ posts })

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
        markdownHooks: [markedHookData(['foo', 1])],
        htmlHooks: [
          (html, data) => {
            expect(data).toEqual({ unknown: ['foo', 1] })

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
            ;(<Post[]>data.posts).forEach((post, i) => {
              expect(post).toEqual(posts[i])
            })

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
            ;(<Post[]>data.posts).forEach((post, i) => {
              expect(post).toEqual(posts[i])
            })

            return html
          }
        ]
      })
    )
    .parse('---\ndatasource: "./test/fixtures/posts.json"\n---\n')
})

type Post = { title: string; body: string }

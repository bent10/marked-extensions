/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import markedFigure from '../src/index.js'

const parse = (md: string) => new Marked().use(markedFigure()).parse(md)

it('should render a standalone image as a figure', () => {
  expect(parse('![A cat](cat.png "Title")')).toMatchInlineSnapshot(`
    "<figure><img src="cat.png" alt="A cat" title="Title"><figcaption aria-hidden="true">A cat</figcaption></figure>
    "
  `)
})

it('should render inline markdown in the caption', () => {
  expect(parse('![A *big* `cat`](cat.png)')).toMatchInlineSnapshot(`
    "<figure><img src="cat.png" alt="A big cat"><figcaption aria-hidden="true">A <em>big</em> <code>cat</code></figcaption></figure>
    "
  `)
})

it('should omit the figcaption when alt text is empty', () => {
  expect(parse('![](cat.png)')).toMatchInlineSnapshot(`
    "<figure><img src="cat.png" alt=""></figure>
    "
  `)
})

it('should keep a paragraph when the image is not alone', () => {
  expect(parse('Look: ![A cat](cat.png)')).toMatchInlineSnapshot(`
    "<p>Look: <img src="cat.png" alt="A cat"></p>
    "
  `)
  expect(parse('![A cat](cat.png) ![A dog](dog.png)')).toMatchInlineSnapshot(`
    "<p><img src="cat.png" alt="A cat"> <img src="dog.png" alt="A dog"></p>
    "
  `)
})

it('should keep a paragraph for a linked image', () => {
  expect(parse('[![A cat](cat.png)](https://example.com)'))
    .toMatchInlineSnapshot(`
    "<p><a href="https://example.com"><img src="cat.png" alt="A cat"></a></p>
    "
  `)
})

it('should leave other paragraphs unchanged', () => {
  expect(parse('Just text.')).toMatchInlineSnapshot(`
    "<p>Just text.</p>
    "
  `)
})

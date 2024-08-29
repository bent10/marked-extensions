/// <reference types="vitest/globals" />

import { Marked } from 'marked'
import prettierSvelte from 'prettier-plugin-svelte'
import markedCodeFormat from '../src/index.js'

it('should format code blocks using Prettier with default options', async () => {
  const md =
    '\n```js prettier\nfoo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());\n```'

  const html = await new Marked().use(markedCodeFormat()).parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should format code blocks using Prettier with specified parser', async () => {
  const md =
    '\n```ts prettier="{ parser: \'typescript\' }"\n@observer class OrderLine {\n  @observable price: number = 0;\n}\n```'

  const html = await new Marked().use(markedCodeFormat()).parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should handle unsupported code block languages', async () => {
  const md =
    '\n```unsupported-language prettier\nconst user: { [key: string]: string \n| number | boolean } = {\n name: "John Doe", age: 30 };\n```'

  const html = await new Marked().use(markedCodeFormat()).parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should handle extended language mappings', async () => {
  const md = `
\`\`\`svelte prettier
<span><div>foo</div><span>bar</span></span>
<div pretend break>content</div>
\`\`\`
`

  const html = await new Marked()
    .use(
      markedCodeFormat({
        plugins: [prettierSvelte]
      })
    )
    .parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should handle formatting failures and preserve the original code block', async () => {
  // invalid TypeScript code to trigger a formatting failure
  const md = '```ts prettier\nconst x number = 1 // missing :\n```'

  const html = await new Marked().use(markedCodeFormat()).parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should not transform code blocks that do not have `prettier` attribute', async () => {
  const md =
    '\n```js\nfoo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());\n```'

  const html = await new Marked().use(markedCodeFormat()).parse(md)

  expect(String(html)).toMatchSnapshot()
})

it('should be consumable by subsequent extensions', async () => {
  await new Marked()
    .use({ gfm: true })
    .use(markedCodeFormat())
    .use({
      walkTokens(token) {
        if (token.type !== 'code') return

        expect(token.lang).toMatch(/prettier/)
      }
    })
    .parse('```js prettier\n<Foo />\n```')
})

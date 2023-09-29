import type { HtmlHook, MarkdownHook } from '../src/index.js'

async function mockAsyncData() {
  return { foo: 'bar' }
}

export const markdownHookAsync: MarkdownHook = async (markdown, data) => {
  Object.assign(data, await mockAsyncData())

  return markdown
}

export const htmlHookAsync: HtmlHook = async (html, data) => {
  Object.assign(data, { baz: true })

  return html
}

export const layoutHook: HtmlHook = (html, data) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
  </head>

  <body>
    ${html}
  </body>
</html>
`
}

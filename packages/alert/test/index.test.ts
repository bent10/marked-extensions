/// <reference types="vitest/globals" />

import { readFileSync } from 'node:fs'
import { marked } from 'marked'
import markedAlert from '../src/index.js'

it('should render default alerts', () => {
  const md = readFileSync('test/fixtures/base.md', 'utf8')
  const html = marked.use(markedAlert()).parse(md)

  expect(html).toMatchSnapshot()
})

it('should render an alert with custom class name', () => {
  const md = '> > [!NOTE]\n> This is a note!\n'
  const html = marked.use(markedAlert({ className: 'foo' })).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<blockquote>
    <div class=\\"foo foo-note\\">
    <p><span class=\\"color-fg-accent text-semibold d-inline-flex flex-items-center mb-1\\"><svg class=\\"octicon octicon-info mr-2\\" viewBox=\\"0 0 16 16\\" version=\\"1.1\\" width=\\"16\\" height=\\"16\\" aria-hidden=\\"true\\"><path d=\\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\\"></path></svg>Note</span><br />This is a note!</p>
    </div>
    </blockquote>
    "
  `)
})

it('should render an alert with custom variant', () => {
  const md = '> **Danger**\nThis is a custom alert!\n'
  const html = marked
    .use(
      markedAlert({
        variants: [{ type: 'danger', icon: '<i class="mr-2">🚨</i>' }]
      })
    )
    .parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<div class=\\"markdown-alert markdown-alert-danger\\">
    <p><span class=\\"text-danger\\"><i class=\\"mr-2\\">🚨</i>Danger</span><br />This is a custom alert!</p>
    </div>
    "
  `)
})

it('should render an alert with custom variant title', () => {
  const md = '> **Danger**\nThis is a custom alert!\n'
  const html = marked
    .use(
      markedAlert({
        variants: [
          { type: 'danger', icon: '<i class="mr-2">🚨</i>', title: 'Oh snap!' }
        ]
      })
    )
    .parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<div class=\\"markdown-alert markdown-alert-danger\\">
    <p><span class=\\"text-danger\\"><i class=\\"mr-2\\">🚨</i>Oh snap!</span><br />This is a custom alert!</p>
    </div>
    "
  `)
})

it('should render an alert with custom variant titleClassName', () => {
  const md = '> **Danger**\nThis is a custom alert!\n'
  const html = marked
    .use(
      markedAlert({
        variants: [
          {
            type: 'danger',
            icon: '<i class="mr-2">🚨</i>',
            titleClassName: 'text-danger fw-medium me-2'
          }
        ]
      })
    )
    .parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<div class=\\"markdown-alert markdown-alert-danger\\">
    <p><span class=\\"text-danger fw-medium me-2\\"><i class=\\"mr-2\\">🚨</i>Danger</span><br />This is a custom alert!</p>
    </div>
    "
  `)
})

it('should render alert with blockquote', () => {
  const md = `> **Warning**
> > multi line
> >
> > blockquote before
>
> This is a warning
`
  const html = marked.use(markedAlert()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<div class=\\"markdown-alert markdown-alert-warning\\">
    <p><span class=\\"color-fg-attention text-semibold d-inline-flex flex-items-center mb-1\\"><svg class=\\"octicon octicon-alert mr-2\\" viewBox=\\"0 0 16 16\\" version=\\"1.1\\" width=\\"16\\" height=\\"16\\" aria-hidden=\\"true\\"><path d=\\"M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z\\"></path></svg>Warning</span></p>
    <blockquote>
    <p>multi line</p>
    <p>blockquote before</p>
    </blockquote>
    <p>This is a warning</p>
    </div>
    "
  `)
})

it('should render alert inside blockquote', () => {
  const md = `> This is a blockquote with
>
> > **Note**
> > note inside
`
  const html = marked.use(markedAlert()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<blockquote>
    <p>This is a blockquote with</p>
    <div class=\\"markdown-alert markdown-alert-note\\">
    <p><span class=\\"color-fg-accent text-semibold d-inline-flex flex-items-center mb-1\\"><svg class=\\"octicon octicon-info mr-2\\" viewBox=\\"0 0 16 16\\" version=\\"1.1\\" width=\\"16\\" height=\\"16\\" aria-hidden=\\"true\\"><path d=\\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\\"></path></svg>Note</span><br />note inside</p>
    </div>
    </blockquote>
    "
  `)
})

it('should render nested alert', () => {
  const md = `> **Note**
> nested note
>
> > **Note**
> > This is a note
`
  const html = marked.use(markedAlert()).parse(md)

  expect(html).toMatchInlineSnapshot(`
    "<div class=\\"markdown-alert markdown-alert-note\\">
    <p><span class=\\"color-fg-accent text-semibold d-inline-flex flex-items-center mb-1\\"><svg class=\\"octicon octicon-info mr-2\\" viewBox=\\"0 0 16 16\\" version=\\"1.1\\" width=\\"16\\" height=\\"16\\" aria-hidden=\\"true\\"><path d=\\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\\"></path></svg>Note</span><br />nested note</p>
    <div class=\\"markdown-alert markdown-alert-note\\">
    <p><span class=\\"color-fg-accent text-semibold d-inline-flex flex-items-center mb-1\\"><svg class=\\"octicon octicon-info mr-2\\" viewBox=\\"0 0 16 16\\" version=\\"1.1\\" width=\\"16\\" height=\\"16\\" aria-hidden=\\"true\\"><path d=\\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\\"></path></svg>Note</span><br />This is a note</p>
    </div>
    </div>
    "
  `)
})

it('should render complex alerts', () => {
  const md = readFileSync('test/fixtures/complex.md', 'utf8')
  const html = marked.use(markedAlert()).parse(md)

  expect(html).toMatchSnapshot()
})

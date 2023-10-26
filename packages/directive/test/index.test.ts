/// <reference types="vitest/globals" />

import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import {
  createDirectives,
  presetDirectiveConfigs,
  type DirectiveConfig
} from '../src/index.js'
import { getDirectivePattern } from '../src/utils.js'

describe('createDirectives', () => {
  it('should handle default preset', () => {
    const md = readFileSync('test/fixtures/preset.md', 'utf8')
    const html = new Marked().use(createDirectives()).parse(md)

    expect(html).toMatchInlineSnapshot(`
    "<h1>Example</h1>
    <main id=\\"foo\\" class=\\"bar baz qux\\">
    <p>Directives syntax<br /></p>
    <div class=\\"separator\\"></div>
    <p>You can use <i>CSS</i> (Cascading Style Sheets) to style your <abbr title=\\"HyperText Markup Language\\">HTML</abbr>.</p>
    </main>
    "
  `)
  })

  it('should handle nested container directives', () => {
    const markdown = `::::example{#foo.bar}
:::file{name="index.html"}
\`\`\`html
<div class="example">
  <p>example code here</p>
</div>
\`\`\`
:::
::::
`

    const html = new Marked()
      .use(
        createDirectives([
          ...presetDirectiveConfigs,
          { level: 'container', marker: '::::' }
        ])
      )
      .parse(markdown)

    expect(html).toMatchInlineSnapshot(`
      "<example id=\\"foo\\" class=\\"bar\\">
      <file name=\\"index.html\\">
      <pre><code class=\\"language-html\\">&lt;div class=&quot;example&quot;&gt;
        &lt;p&gt;example code here&lt;/p&gt;
      &lt;/div&gt;
      </code></pre>
      </file>
      </example>
      "
    `)
  })

  it('should handle custom directives', () => {
    const md = readFileSync('test/fixtures/custom.md', 'utf8')

    // defines `:youtube` directive
    const youtubeDirective: DirectiveConfig = {
      level: 'block',
      marker: '::',
      renderer(token) {
        if (token.meta.name === 'youtube') {
          return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${
            token.attrs?.vid || ''
          }" title="${
            token.text
          }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
        }

        return false
      }
    }

    // defines `@mention` directive
    const mentionDirective: DirectiveConfig = {
      level: 'inline',
      marker: '@',
      renderer(token) {
        return `<a class="user-mention notranslate" href="/users/${token.meta.name}">${token.meta.name}</a>`
      }
    }

    // defines `#hashtag` directive
    const hashtagDirective: DirectiveConfig = {
      level: 'inline',
      marker: '#',
      renderer(token) {
        return `<a class="hashtag" href="/tags/${token.meta.name}">${token.meta.name}</a>`
      }
    }

    // defines `:emoji` directive
    const emojis = { rocket: '🚀', 'red-exclamation': '❗' } // mock emoji api
    const emojiDirective: DirectiveConfig = {
      level: 'inline',
      marker: ':',
      renderer(token) {
        if (token.meta.name === 'emoji') {
          return `<span ${token.attrs?.toString()}>${emojis[token.text]}</span>`
        }

        return false
      }
    }

    const html = new Marked()
      .use(
        createDirectives([
          ...presetDirectiveConfigs,
          youtubeDirective,
          mentionDirective,
          hashtagDirective,
          emojiDirective
        ])
      )
      .parse(md)

    expect(html).toMatchInlineSnapshot(`
      "<h1>Example</h1>
      <main id=\\"foo\\" class=\\"bar baz qux\\">
      <p><a href=\\"https://talk.commonmark.org/t/generic-directives-plugins-syntax/444\\">Directives syntax</a></p>
      <hr class=\\"border-muted\\" />
      <p>Use <i>CSS</i> (Cascading Style Sheets) to style your <abbr title=\\"HyperText Markup Language\\">HTML</abbr><span undefined>❗</span></p>
      </main>
      <p>You can define custom directives, like so:</p>
      <iframe width=\\"560\\" height=\\"315\\" src=\\"https://www.youtube.com/embed/9xwazD5SyVg\\" title=\\"Dummy video\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\\" allowfullscreen></iframe><ol>
      <li><a class=\\"user-mention notranslate\\" href=\\"/users/bent10\\">bent10</a></li>
      <li><a class=\\"hashtag\\" href=\\"/tags/markdown\\">markdown</a></li>
      <li><span title=\\"Go!\\">🚀</span></li>
      </ol>
      <p>And whatever is on your mind 🤯.</p>
      "
    `)
  })
})

describe('getDirectivePattern', () => {
  it('should return the correct pattern for container level', () => {
    const pattern = getDirectivePattern('container', ':::')
    // ^:::(.*?\n[\s\S]*?)\n:::\n
    expect(pattern).toEqual('^:::([\\s\\S]*?)\\n:::')
  })

  it('should return the correct pattern for block level', () => {
    const pattern = getDirectivePattern('block', '::')
    expect(pattern).toEqual('^::((?:[a-zA-Z][\\w-]*|[\\{\\[].*?[\\}\\]])+)')
  })

  it('should return the correct pattern for inline level', () => {
    const pattern = getDirectivePattern('inline', ':')
    expect(pattern).toEqual(
      '^:((?:[a-zA-Z][\\w-]*|[\\{].*?[\\}]+|[\\[].*?[\\]])+)'
    )
  })
})

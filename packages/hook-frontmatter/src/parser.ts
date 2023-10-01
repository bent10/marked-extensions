import moo from 'moo'
import yaml, { type LoadOptions } from 'js-yaml'

// Define a lexer for frontmatter and content.
const lexer = moo.states({
  main: {
    openTag: { match: /^---\n/, lineBreaks: true, push: 'matter' }
  },
  matter: {
    closeTag: { match: /^---\n/, lineBreaks: true, push: 'content' },
    data: /.+/,
    lineBreak: { match: /\n+/, lineBreaks: true }
  },
  content: {
    placeholder: {
      match: /{[ \t]*?(?:[a-zA-Z_][\w\d\.]*?|[\d][\w\d\.]+)[ \t]*?}/,
      value(x) {
        return x.replace(/[ \t]+/g, '')
      }
    },
    chunk: moo.fallback
  }
})

/**
 * Parse frontmatter and content from a Markdown document.
 *
 * @param markdown - The Markdown document to parse.
 * @param options - YAML loading options.
 * @returns An object with frontmatter data and content.
 */
export function parse(markdown: string, options: LoadOptions) {
  lexer.reset(markdown)
  let frontmatter = ''
  let content = ''

  for (const token of lexer) {
    switch (token.type) {
      case 'openTag':
      case 'data':
      case 'lineBreak':
        frontmatter += token.value
        break
      case 'chunk':
      case 'placeholder':
        content += token.value
        break
    }
  }

  const matter = yaml.load(frontmatter, options)

  return { matter, content }
}

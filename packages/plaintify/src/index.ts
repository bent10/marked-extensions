import { Renderer, MarkedExtension, RendererObject } from 'marked'

/**
 * Options for configuring the markedPlaintify extension.
 */
export type Options = RendererObject & {
  /**
   * Custom 3rd-party renderers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: (this: Renderer, ...args: any[]) => string | false
}

/**
 * A [marked](https://marked.js.org/) extension to convert Markdown to Plaintext.
 */
export default function markedPlaintify(
  options: Options = {}
): MarkedExtension {
  const plainTextRenderer: Options = {}
  const mdIgnores: string[] = ['constructor', 'hr', 'checkbox', 'br', 'space']
  const mdInlines: string[] = ['strong', 'em', 'del']
  const mdEscapes: string[] = ['html', 'code']

  let currentTableHeader: string[] = []

  Object.getOwnPropertyNames(Renderer.prototype).forEach(prop => {
    if (mdIgnores.includes(prop)) {
      // ignore certain Markdown elements
      plainTextRenderer[prop] = () => ''
    } else if (mdInlines.includes(prop)) {
      // preserve inline elements
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parseInline(token.tokens)
        return text
      }
    } else if (mdEscapes.includes(prop)) {
      // escaped elements
      plainTextRenderer[prop] = token => escapeHTML(token.text) + '\n\n'
    } else if (prop === 'codespan') {
      // handle codespan
      plainTextRenderer[prop] = token => escapeHTML(token.text)
    } else if (prop === 'list') {
      // handle list element
      plainTextRenderer[prop] = function (token) {
        let text = ''
        for (let j = 0; j < token.items.length; j++) {
          const item = token.items[j]
          const renderedItem = this.listitem(item)

          if (typeof renderedItem === 'string') {
            text += renderedItem.replace(/\n{2,}/g, '\n')
          }
        }

        return '\n' + text.trim() + '\n\n'
      }
    } else if (prop === 'listitem') {
      // handle list items
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parse(token.tokens)
        return '\n' + text.trim()
      }
    } else if (prop === 'blockquote') {
      // handle blockquote
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parse(token.tokens)
        return text.trim() + '\n\n'
      }
    } else if (prop === 'table') {
      // handle table elements
      plainTextRenderer[prop] = function (token) {
        currentTableHeader = []

        // parsing headers
        for (let j = 0; j < token.header.length; j++) {
          this.tablecell(token.header[j])
        }

        // parsing rows
        let body = ''
        for (let j = 0; j < token.rows.length; j++) {
          const row = token.rows[j]
          let cell = ''
          for (let k = 0; k < row.length; k++) {
            cell += this.tablecell(row[k])
          }
          body += this.tablerow({ text: cell })
        }

        return body
      }
    } else if (prop === 'tablerow') {
      // handle table rows
      plainTextRenderer[prop] = token => {
        const chunks = token.text.split('__CELL_PAD__').filter(Boolean)

        return (
          currentTableHeader
            .map((title, i) => title + ': ' + chunks[i])
            .join('\n') + '\n\n'
        )
      }
    } else if (prop === 'tablecell') {
      // handle table cells
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parseInline(token.tokens)

        if (token.header) {
          currentTableHeader.push(text)
        }

        return text + '__CELL_PAD__'
      }
    } else if (prop === 'link') {
      // handle links
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parseInline(token.tokens)
        return text + '\n\n'
      }
    } else if (prop === 'image') {
      // handle images (links starting with !)
      plainTextRenderer[prop] = token => {
        return token.text + '\n\n'
      }
    } else if (prop === 'paragraph') {
      // handle paragraphs (which sometimes link and images lines are detected as well)
      plainTextRenderer[prop] = function (token) {
        let text = this.parser.parseInline(token.tokens)

        // Removing extra newlines introduced by other renderer functions
        text = text.replace(/\n{2,}/g, '')

        return text + '\n\n'
      }
    } else if (prop === 'heading') {
      // handle headings
      plainTextRenderer[prop] = function (token) {
        const text = this.parser.parseInline(token.tokens)
        return text + '\n\n'
      }
    } else {
      // handle other elements
      plainTextRenderer[prop] = function (token) {
        return 'tokens' in token && token.tokens
          ? this.parser.parseInline(token.tokens)
          : token.text
      }
    }
  })

  return {
    useNewRenderer: true,
    renderer: {
      ...plainTextRenderer,
      ...options
    }
  }
}

/**
 * Escapes HTML characters in a string.
 */
function escapeHTML(html: string): string {
  const escapeMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }

  return html.replace(/[&<>"']/g, match => escapeMap[match])
}

import { Renderer, MarkedExtension, RendererObject } from 'marked'

/**
 * Options for configuring the markedPlaintify extension.
 */
export type Options = RendererObject & {
  /**
   * Custom 3rd-party renderers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: (...args: any[]) => string | false
}

/**
 * A [marked](https://marked.js.org/) extension to convert Markdown to Plaintext.
 */
export default function markedPlaintify(
  options: Options = {}
): MarkedExtension {
  const plainTextRenderer: Options = {}
  const mdIgnores: string[] = ['constructor', 'hr', 'checkbox', 'br']
  const mdInlines: string[] = ['strong', 'em', 'codespan', 'del', 'text']
  const mdEscapes: string[] = ['html', 'code', 'codespan']

  let currentTableHeader: string[] = []

  Object.getOwnPropertyNames(Renderer.prototype).forEach(prop => {
    if (mdIgnores.includes(prop)) {
      // ignore certain Markdown elements
      plainTextRenderer[prop] = () => ''
    } else if (mdInlines.includes(prop)) {
      // preserve inline elements
      plainTextRenderer[prop] = text => text
    } else if (mdEscapes.includes(prop)) {
      // escaped elements
      plainTextRenderer[prop] = text => escapeHTML(text) + '\n\n'
    } else if (prop === 'list') {
      // handle list element
      plainTextRenderer[prop] = text => '\n' + text.trim() + '\n\n'
    } else if (prop === 'listitem') {
      // handle list items
      plainTextRenderer[prop] = text => '\n' + text.trim()
    } else if (prop === 'blockquote') {
      // handle list items
      plainTextRenderer[prop] = text => text.trim() + '\n\n'
    } else if (prop === 'table') {
      // handle table elements
      plainTextRenderer[prop] = (_, body) => {
        currentTableHeader = []
        return body
      }
    } else if (prop === 'tablerow') {
      // handle table rows
      plainTextRenderer[prop] = content => {
        const chunks = content.split('__CELL_PAD__').filter(Boolean)

        return (
          currentTableHeader
            .map((title, i) => title + ': ' + chunks[i])
            .join('\n') + '\n\n'
        )
      }
    } else if (prop === 'tablecell') {
      // handle table cells
      plainTextRenderer[prop] = (text, flags) => {
        if (flags.header) {
          currentTableHeader.push(text)
        }
        return text + '__CELL_PAD__'
      }
    } else if (prop === 'link' || prop === 'image') {
      // handle links and images
      plainTextRenderer[prop] = (_, __, text) => (!!text ? text : '')
    } else {
      // handle other (often block-level) elements
      plainTextRenderer[prop] = text => text + '\n\n'
    }
  })

  return {
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

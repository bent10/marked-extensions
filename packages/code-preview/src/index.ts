import { parseAttrs } from 'attributes-parser'
import type { MarkedExtension } from 'marked'
import { transform } from './transformer.js'
import type { Options, Transformer } from './types.js'

/**
 * A [marked](https://marked.js.org/) extension to transform code blocks within Markdown documents
 * into code previews.
 */
export default function markedCodePreview(
  options: Options = {}
): MarkedExtension {
  return {
    extensions: [
      {
        name: 'fences',
        level: 'block',
        tokenizer(_, parent) {
          const data: { [key: string]: string } = {}

          if (
            this.lexer.options.hooks &&
            this.lexer.options.hooks !== null &&
            'data' in this.lexer.options.hooks
          ) {
            Object.assign(data, this.lexer.options.hooks.data)
          }

          parent.forEach((token, index) => {
            if (token.type !== 'code' || !token.lang) return

            const lang = token.lang?.split(' ')
            const { preview, ...meta } = parseAttrs(token.lang)

            if (!preview) return

            transform(token, {
              index,
              parent,
              data,
              attrs: { lang, ...meta },
              ...options
            })
          })

          return undefined
        }
      }
    ]
  }
}

export type { Options, Transformer }

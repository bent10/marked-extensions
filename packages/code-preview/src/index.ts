import { parseAttrs } from 'attributes-parser'
import type { MarkedExtension } from 'marked'
import { transform } from './transformer.js'
import type { Options } from './types.js'

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
        name: 'code',
        level: 'block',
        tokenizer(_, parent) {
          const { data, ...restOptions } = options

          parent.forEach((token, index) => {
            if (token.type !== 'code' || !token.lang) return

            const { preview, ...meta } = parseAttrs(token.lang)

            if (!preview) return

            transform(token, {
              index,
              parent,
              data: { ...data, ...meta },
              ...restOptions
            })
          })

          return undefined
        }
      }
    ]
  }
}

export type { Options }

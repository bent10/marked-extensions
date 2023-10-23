import type { MarkedExtension, Tokens } from 'marked'
import type { Alert, AlertVariantItem, Options } from './types.js'
import { createSyntaxPattern, resolveVariants, ucFirst } from './utils.js'

export type { Alert, AlertVariantItem, Options }

/**
 * A [marked](https://marked.js.org/) extension to support [GFM alerts](https://github.com/orgs/community/discussions/16925).
 */
export default function markedAlert(options: Options = {}): MarkedExtension {
  const { className = 'markdown-alert', variants = [] } = options
  const resolvedVariants = resolveVariants(variants)

  return {
    walkTokens(token) {
      if (token.type !== 'blockquote') return

      const matchedVariant = resolvedVariants.find(({ type }) =>
        new RegExp(createSyntaxPattern(type)).test(token.text)
      )

      if (matchedVariant) {
        const {
          type: variantType,
          icon,
          titleClassName = `text-${variantType}`
        } = matchedVariant
        const firstLine = token.tokens?.[0] as Tokens.Paragraph
        const firstLineText = firstLine.raw?.replace(
          new RegExp(createSyntaxPattern(variantType)),
          ''
        )
        firstLine.tokens = [
          <Tokens.Text>{
            type: 'text',
            raw: firstLine.raw,
            text: `<span class="${titleClassName} text-semibold d-inline-flex flex-items-center mb-1">${
              icon + ucFirst(variantType)
            }</span>${firstLineText ? `<br />${firstLineText}` : ''}`
          }
        ]

        Object.assign(token, {
          type: 'alert',
          meta: { variant: variantType, icon, titleClassName }
        })

        token.tokens?.splice(0, 1, firstLine)
      }
    },
    extensions: [
      {
        name: 'alert',
        level: 'block',
        renderer({ meta, tokens = [] }) {
          let tmpl = `<div class="${className} ${className}-${meta.variant}">\n`
          tmpl += this.parser.parse(tokens)
          tmpl += '</div>\n'

          return tmpl
        }
      }
    ]
  }
}

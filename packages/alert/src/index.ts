import type { MarkedExtension, Tokens } from 'marked'
import type { Alert, AlertVariantItem, Options } from './types.js'
import { createSyntaxPattern, resolveVariants, ucfirst } from './utils.js'

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
          title = ucfirst(variantType),
          titleClassName = `${className}-title`
        } = matchedVariant

        Object.assign(token, {
          type: 'alert',
          meta: {
            className,
            variant: variantType,
            icon,
            title,
            titleClassName
          }
        })
      }
    },
    extensions: [
      {
        name: 'alert',
        level: 'block',
        renderer(token) {
          const { meta, tokens = [] } = token as Alert
          const firstLine = tokens[0] as Tokens.Paragraph
          const firstLineText = firstLine.raw
            ?.replace(new RegExp(createSyntaxPattern(meta.variant)), '')
            .trim()

          let tmpl = `<div class="${meta.className} ${meta.className}-${meta.variant}">\n`
          tmpl += `<p class="${meta.titleClassName}">`
          tmpl += meta.icon
          tmpl += meta.title
          tmpl += '</p>\n'
          tmpl += firstLineText ? `<p>${firstLineText}</p>\n` : ''
          tmpl += this.parser.parse(tokens.slice(1))
          tmpl += '</div>\n'

          return tmpl
        }
      }
    ]
  }
}

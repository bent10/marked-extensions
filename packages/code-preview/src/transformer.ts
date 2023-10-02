import type { Tokens } from 'marked'
import pupa from 'pupa'
import { ATTR_PATTERN, DEFAULT_TEMPLATE } from './constants.js'
import {
  createHtmlToken,
  createTemplateList,
  normalizeCodeText
} from './utils.js'
import type { TransformOptions } from './types.js'

/**
 * Transform markdown code blocks using a given template.
 *
 * @param token - The Markdown code token to transform.
 * @param options - Configuration options for the transformation.
 */
export function transform(token: Tokens.Generic, options: TransformOptions) {
  const { data, index, parent, template = DEFAULT_TEMPLATE } = options

  // tokenize template
  const templateList = createTemplateList(template)

  // remove the 'preview' attribute
  const rawHead = token.raw?.split('\n')[0].replace(ATTR_PATTERN, '')
  token.raw = token.raw?.split('\n').splice(0, 1, rawHead).join('\n')
  token.lang = token.lang?.replace(ATTR_PATTERN, '')

  // data for interpolation
  const dataInterpolation = {
    ...data,
    preview: token.text
  }

  const acc: Array<Tokens.Code | Tokens.Generic | Tokens.HTML | Tokens.Space> =
    []

  for (const { type, text } of templateList) {
    if (type === 'placeholder') {
      acc.push(token)
    } else if (type === 'text') {
      const renderedValue = pupa(normalizeCodeText(text), dataInterpolation, {
        ignoreMissing: true
      })
      acc.push(createHtmlToken(renderedValue))
    }
  }

  parent.splice(index, 1, ...acc)
}

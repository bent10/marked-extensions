import { transformSync } from '@babel/core'
import type { Tokens } from 'marked'
import { ATTR_PATTERN } from './constants.js'
import { removeImport } from './utils.js'
import type { TransformOptions } from './types.js'

/**
 * Transform markdown code blocks using jsx renderer.
 *
 * @param token - The Markdown code token to transform.
 * @param options - Configuration options for the transformation.
 */
export function transform(token: Tokens.Generic, options: TransformOptions) {
  const {
    index,
    parent,
    components = {},
    Fragment,
    jsx,
    jsxs,
    renderer,
    sanitizer,
    unwrap
  } = options

  if (!jsx || !renderer) return

  const newToken: Tokens.Generic = { type: 'code', raw: '' }
  const code = token.text

  try {
    const safeValue = sanitizer ? sanitizer(code) : code
    const result = transformSync(safeValue, {
      plugins: [removeImport],
      presets: [
        ['@babel/preset-react', { runtime: 'automatic', development: false }]
      ]
    })

    // Create a dynamic function using new Function to render the code value's JSX.
    const Component = new Function(
      'Fragment',
      '_jsx',
      '_jsxs',
      ...Object.keys(components),
      `return ${result?.code}`
    )

    const renderedValue = renderer(
      Component(Fragment, jsx, jsxs, ...Object.values(components))
    )

    if (unwrap) {
      Object.assign(newToken, {
        type: 'html',
        block: true,
        raw: renderedValue,
        pre: false,
        text: renderedValue
      })
    } else {
      const langChunk = token.lang.replace(ATTR_PATTERN, '').split(' ')
      langChunk.splice(0, 1, 'html')
      const lang = langChunk.join(' ')

      Object.assign(newToken, {
        lang,
        raw: '```' + lang + '\n' + renderedValue + '\n```',
        text: renderedValue
      })
    }

    parent.splice(index, 1, newToken)
  } catch {
    // preserve the original code block
  }
}

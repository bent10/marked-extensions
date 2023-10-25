import type { RendererThis, Tokens } from 'marked'
import { Directive } from './types.js'
import { isVoidElements } from './utils.js'

/**
 * Default renderer for directive tokens.
 *
 * @param this - The RendererThis context.
 * @param token - The directive token to render.
 * @returns Rendered HTML string.
 */
export function directiveRenderer(this: RendererThis, token: Tokens.Generic) {
  const { meta, attrs, tokens = [] } = token as Directive
  const tagname = meta.name || meta.tag

  let elem = `<${tagname}`
  elem += attrs ? ' ' + attrs.toString() : ''
  elem += isVoidElements(tagname) ? ' />' : '>'
  elem += meta.level === 'container' ? '\n' : ''

  if (!isVoidElements(tagname)) {
    elem +=
      meta.level === 'container'
        ? this.parser.parse(tokens)
        : this.parser.parseInline(tokens)
    elem += `</${tagname}>`
  }

  elem += meta.level === 'inline' ? '' : '\n'

  return elem
}

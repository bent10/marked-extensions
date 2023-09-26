import type { Tokens } from 'marked'
import moo from 'moo'

/**
 * Create a template list using moo.
 *
 * @param template - The template string to parse.
 * @returns An array of moo tokens.
 */
export function createTemplateList(template: string) {
  return moo
    .compile({
      placeholder: /\{code\}/,
      text: moo.fallback
    })
    .reset(template)
}

/**
 * Create an HTML token.
 *
 * @param value - The rendered HTML value.
 * @returns An HTML token.
 */
export function createHtmlToken(value: string): Tokens.HTML {
  return {
    type: 'html',
    block: true,
    raw: value,
    pre: false,
    text: value
  }
}

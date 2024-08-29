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
 * Normalize code text by removing unnecessary whitespace and
 * formatting.
 *
 * @param text - The input code text.
 * @returns The normalized code text.
 */
export function normalizeCodeText(text: string) {
  const lexer = moo
    .compile({
      placeholder: {
        match: /{[ \t]*?(?:[a-zA-Z_][\w\d.]*?|[\d][\w\d.]+)[ \t]*?}/,
        value(x) {
          return x.replace(/[ \t]+/g, '')
        }
      },
      chunk: moo.fallback
    })
    .reset(text)
  let normalizedText = ''

  for (const token of lexer) {
    normalizedText += token.value
  }

  return normalizedText
}

/**
 * Create an HTML token.
 *
 * @param raw - The code before transformed.
 * @param text - The transformed code.
 * @returns An HTML token.
 */
export function createHtmlToken(raw: string, text: string): Tokens.HTML {
  return {
    type: 'html',
    block: true,
    pre: false,
    raw,
    text
  }
}

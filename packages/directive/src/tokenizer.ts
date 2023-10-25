import type { Attributes } from 'attributes-parser'
import type { Token, TokenizerThis } from 'marked'
import moo from 'moo'
import type { Directive, DirectiveMeta } from './types.js'
import { parseAttrsValue } from './utils.js'

const lexer = moo.compile({
  spaces: /[\t\v\f\ufeff ]+/,
  name: /[a-zA-Z][\w-]*/,
  attrs: {
    match: /\{.*\}/,
    value: x => parseAttrsValue(x) as unknown as string
  },
  text: {
    match: /\[.*\]/,
    value: x => x.slice(1, -1)
  },
  blockText: { match: /[\s\S]+/, lineBreaks: true }
})

export interface DirectiveTokenizerConfig extends DirectiveMeta {
  type: string
  raw: string
  content: string
}

/**
 * Create a directive token from a directive string.
 */
export function createToken(
  this: TokenizerThis,
  config: DirectiveTokenizerConfig
) {
  const { type, level, raw, content, marker, tag } = config

  const lex = lexer.reset(content)

  let name,
    attrs: Directive['attrs'],
    text = '',
    tokens: Token[] = []

  for (const { type, value } of lex) {
    switch (type) {
      case 'name':
        name = value
        break
      case 'attrs':
        attrs = value as unknown as Attributes
        break
      case 'text':
      case 'blockText':
        text = value
        tokens =
          level === 'container'
            ? this.lexer.blockTokens(value)
            : this.lexer.inlineTokens(value)
        break
    }
  }

  return <Directive>{
    type,
    raw,
    meta: { level, marker, tag, name },
    attrs,
    text,
    tokens
  }
}

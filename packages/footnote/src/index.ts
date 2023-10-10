import type { MarkedExtension } from 'marked'
import { createFootnote } from './footnote.js'
import { createFootnoteRef } from './references.js'
import { createFootnotes } from './footnotes.js'
import type { LexerTokens, Options } from './types.js'

/**
 * A [marked](https://marked.js.org/) extension to support [GFM footnotes](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes).
 */
export default function markedFootnote(options: Options = {}): MarkedExtension {
  const {
    prefixId = 'footnote-',
    description = 'Footnotes',
    refMarkers
  } = options
  const lexer: LexerTokens = { hasFootnotes: false, tokens: [] }

  return {
    extensions: [
      createFootnote({ prefixId, lexer, description }),
      createFootnoteRef(prefixId, refMarkers),
      createFootnotes(prefixId)
    ],
    walkTokens(token) {
      if (lexer.tokens.indexOf(token) === 0 && token.type === 'footnotes') {
        lexer.tokens.push(lexer.tokens.shift()!)
      }
    }
  }
}

export type { Footnote, FootnoteRef, Footnotes, Options } from './types.js'

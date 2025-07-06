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
    prefixData = '',
    description = 'Footnotes',
    refMarkers = false,
    footnoteDivider = false,
    keepLabels = false,
    sectionClass = 'footnotes',
    headingClass = 'sr-only',
    backRefLabel = 'Back to reference {0}'
  } = options
  const lexer: LexerTokens = { hasFootnotes: false, tokens: [] }

  return {
    extensions: [
      createFootnote(lexer, description),
      createFootnoteRef(prefixId, refMarkers, keepLabels),
      createFootnotes(
        prefixId,
        prefixData,
        footnoteDivider,
        sectionClass,
        headingClass,
        backRefLabel
      )
    ],
    walkTokens(token) {
      if (
        token.type === 'footnotes' &&
        lexer.tokens.indexOf(token) === 0 &&
        token.items.length
      ) {
        lexer.tokens[0] = { type: 'space', raw: '' }
        lexer.tokens.push(token)
      }

      if (lexer.hasFootnotes) lexer.hasFootnotes = false
    }
  }
}

export type { Footnote, FootnoteRef, Footnotes, Options } from './types.js'

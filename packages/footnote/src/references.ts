import type { TokenizerAndRendererExtension, TokenizerThis } from 'marked'
import type { FootnoteRef, Footnotes } from './types.js'

/**
 * Returns an extension object for parsing inline footnote references.
 */
export function createFootnoteRef(prefixId: string, refMarkers = false) {
  let order = 0

  return {
    name: 'footnoteRef',
    level: 'inline',
    tokenizer(this: TokenizerThis, src: string) {
      const match = /^\[\^([^\]\n]+)\]/.exec(src)

      if (match) {
        const [raw, label] = match
        const footnotes = this.lexer.tokens[0] as Footnotes
        const filteredRawItems = footnotes.rawItems.filter(
          item => item.label === label
        )

        if (!filteredRawItems.length) return

        const rawFootnote = filteredRawItems[0]
        const footnote = footnotes.items.filter(item => item.label === label)[0]

        const ref: FootnoteRef = {
          type: 'footnoteRef',
          raw,
          id: '',
          label
        }

        if (footnote) {
          ref.id = footnote.refs[0].id
          footnote.refs.push(ref)
        } else {
          order++
          ref.id = String(order)
          rawFootnote.refs.push(ref)
          footnotes.items.push(rawFootnote)
        }

        return ref
      }
    },
    renderer({ id, label }: FootnoteRef) {
      order = 0 // reset order
      const encodedLabel = encodeURIComponent(label)

      return `<sup><a id="${prefixId}ref-${encodedLabel}" href="#${
        prefixId + encodedLabel
      }" data-${prefixId}ref aria-describedby="${prefixId}label">${
        refMarkers ? `[${id}]` : id
      }</a></sup>`
    }
  } as TokenizerAndRendererExtension
}

import type { TokenizerAndRendererExtension } from 'marked'
import type { FootnoteRef } from './types.js'

/**
 * Returns an extension object for parsing inline footnote references.
 */
export function createFootnoteRef(prefixId: string, refMarkers = false) {
  return {
    name: 'footnoteRef',
    level: 'inline',
    tokenizer(src: string) {
      const match = /^\[\^([^\]\n]+)\]/.exec(src)

      if (match) {
        const [raw, label] = match

        return <FootnoteRef>{
          type: 'footnoteRef',
          raw,
          label
        }
      }
    },
    renderer({ label }: FootnoteRef) {
      const encodedLabel = encodeURIComponent(label)

      return `<sup><a id="${prefixId}ref-${encodedLabel}" href="#${
        prefixId + encodedLabel
      }" data-${prefixId}ref aria-describedby="${prefixId}label">${
        refMarkers ? `[${label}]` : label
      }</a></sup>`
    }
  } as TokenizerAndRendererExtension
}

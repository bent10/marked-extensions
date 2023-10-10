import type { RendererExtension, RendererThis } from 'marked'
import type { Footnotes } from './types.js'

/**
 * Returns an extension object for rendering the list of footnotes.
 */
export function createFootnotes(prefixId: string) {
  return {
    name: 'footnotes',
    renderer(this: RendererThis, { raw, items = [] }: Footnotes) {
      if (items.length === 0) return ''

      const footnotesItemsHTML = items.reduce((acc, { label, content }) => {
        let footnoteItem = `<li id="${prefixId + encodeURIComponent(label)}">\n`
        footnoteItem += this.parser.parse(content)
        footnoteItem += '</li>\n'

        return acc + footnoteItem
      }, '')

      let footnotesHTML = '<section class="footnotes" data-footnotes>\n'
      footnotesHTML += `<h2 id="${prefixId}label" class="sr-only" dir="auto">${raw.trimEnd()}</h2>\n`
      footnotesHTML += `<ol>\n${footnotesItemsHTML}\n</ol>\n`
      footnotesHTML += '</section>\n'

      return footnotesHTML
    }
  } as RendererExtension
}

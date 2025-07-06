import type { RendererExtension, RendererThis } from 'marked'
import type { Footnotes } from './types.js'

/**
 * Returns an extension object for rendering the list of footnotes.
 */
export function createFootnotes(
  prefixId: string,
  prefixData: string,
  footnoteDivider: boolean,
  sectionClass: string,
  headingClass: string,
  backRefLabel: string
) {
  return {
    name: 'footnotes',
    renderer(this: RendererThis, { raw, items = [] }: Footnotes) {
      if (items.length === 0) return ''

      const footnotesItemsHTML = items.reduce(
        (acc, { label, content, refs }) => {
          const encodedLabel = encodeURIComponent(label)
          const parsedContent = this.parser.parse(content).trimEnd()
          const isEndsWithP = parsedContent.endsWith('</p>')

          let footnoteItem = `<li id="${prefixId + encodedLabel}">\n`
          footnoteItem += isEndsWithP
            ? parsedContent.replace(/<\/p>$/, '')
            : parsedContent

          refs.forEach((_, i) => {
            const ariaLabel = backRefLabel.replace('{0}', label)
            let textLabel: string
            let idSuffix: string
            if (i > 0) {
              const displayIndex = i + 1
              textLabel = `↩<sup>${displayIndex}</sup>`
              idSuffix = `-${displayIndex}`
            } else {
              textLabel = '↩'
              idSuffix = ''
            }
            footnoteItem += ` <a href="#${prefixId}ref-${encodedLabel}${idSuffix}" data-${prefixId}backref aria-label="${ariaLabel}">${textLabel}</a>`
          })

          footnoteItem += isEndsWithP ? '</p>\n' : '\n'
          footnoteItem += '</li>\n'

          return acc + footnoteItem
        },
        ''
      )

      let footnotesHTML = ''
      if (footnoteDivider) {
        footnotesHTML += `<hr data-${prefixData}footnotes>\n`
      }
      let sectionAttrs = ''
      if (sectionClass) {
        sectionAttrs = ` class="${sectionClass}"`
      }
      let headingAttrs = ''
      if (headingClass) {
        headingAttrs = ` class="${headingClass}"`
      }
      footnotesHTML += `<section${sectionAttrs} data-${prefixData}footnotes>\n`
      footnotesHTML += `<h2 id="${prefixId}label"${headingAttrs}>${raw.trimEnd()}</h2>\n`
      footnotesHTML += `<ol>\n${footnotesItemsHTML}</ol>\n`
      footnotesHTML += '</section>\n'

      return footnotesHTML
    }
  } as RendererExtension
}

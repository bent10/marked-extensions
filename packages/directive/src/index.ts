import type { MarkedExtension } from 'marked'
import seedrandom from 'seedrandom/lib/alea'
import { createToken } from './tokenizer.js'
import { directiveRenderer } from './renderer.js'
import { getDirectivePattern, ucFirst } from './utils.js'
import type { DirectiveConfig } from './types.js'

/**
 * Default configurations for common directives.
 */
export const presetDirectiveConfigs: DirectiveConfig[] = [
  { level: 'container', marker: ':::' },
  { level: 'block', marker: '::' },
  { level: 'inline', marker: ':' }
]

/**
 * A [marked](https://marked.js.org/) extension to support [directives syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444).
 */
export function createDirectives(
  configs: DirectiveConfig[] = presetDirectiveConfigs
): MarkedExtension {
  return {
    extensions: configs.map(
      ({ level, marker, tag, renderer: customRenderer }) => {
        const id = seedrandom(marker).int32()
        const type = `directive${ucFirst(level)}${id}`

        return {
          name: type,
          level: level === 'inline' ? 'inline' : 'block',
          start: src => src.match(new RegExp(marker))?.index,
          tokenizer(src) {
            const pattern = getDirectivePattern(level, marker)
            const match = src.match(new RegExp(pattern))

            if (match) {
              const [raw, content = ''] = match
              return createToken.call(this, {
                type,
                level,
                raw,
                content,
                marker,
                tag: tag || (level === 'inline' ? 'span' : 'div')
              })
            }
          },
          renderer: customRenderer || directiveRenderer
        }
      }
    )
  }
}

export { isVoidElements } from './utils.js'
export type * from './types.js'

import type { MarkedExtension } from 'marked'
import { reducer } from './reducer.js'
import type { HooksWithData, Options } from './types.js'

/**
 * A [marked](https://marked.js.org/) extension that allows preprocessing and post-processing of
 * Markdown, sequentially.
 *
 * Each hook is executed sequentially, and the result of one hook is passed as
 * input to the next hook. This allows you to apply a series of transformations
 * to the markdown or HTML content before or after it is processed by the
 * marked library, depending on your needs.
 *
 * @param options Configuration options for the
 *   `markedSequentialHooks` function.
 * @returns A `MarkedExtension` object to be used with `marked`.
 */
export default function markedSequentialHooks(
  options: Options = {}
): MarkedExtension {
  const { htmlHooks = [], markdownHooks = [] } = options

  return {
    hooks: {
      preprocess(markdown) {
        return reducer.call(this as HooksWithData, markdownHooks, markdown)
      },
      postprocess(html) {
        return reducer.call(this as HooksWithData, htmlHooks, html)
      }
    }
  }
}

export type { HooksWithData, HtmlHook, MarkdownHook, Options } from './types.js'

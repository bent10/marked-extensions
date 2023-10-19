import path from 'node:path'
import type { HtmlHook } from 'marked-sequential-hooks'
import { transform } from './transformer.js'
import type { Options } from './types.js'

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked that handles layouts.
 */
export default function markedHookLayout(options: Options = {}): HtmlHook {
  const {
    dir = 'layouts',
    name = 'default',
    placeholder = /<Outlet[ \t]*?\/>/
  } = options

  /**
   * @param html - The HTML content to insert into the layout.
   * @param data - Additional data to use when rendering the layout.
   * @param isAsync - Indicates whether the operation is asynchronous.
   * @returns The HTML content with the layout applied.
   */
  return (html, data, isAsync) => {
    const dataPrefix = data.matterDataPrefix as string | false
    const matter = dataPrefix ? (data[dataPrefix] as typeof data) : data

    const target = typeof matter.layout === 'string' ? matter.layout : name
    const source = path.join(
      dir,
      /\.html$/.test(target) ? target : target + '.html'
    )

    return transform(source, {
      content: html,
      placeholder,
      isAsync
    })
  }
}

export type { Options }

import fs, { promises as fsp } from 'node:fs'
import path from 'node:path'
import pupa from 'pupa'
import type { HtmlHook } from 'marked-sequential-hooks'
/**
 * Represents the options for the `markedHookLayout` function.
 */
export interface Options {
  /**
   * The directory where layouts are stored.
   *
   * @default 'layouts'
   */
  dir?: string

  /**
   * The name of the layout to use.
   *
   * @default 'default'
   */
  name?: string

  /**
   * The placeholder to replace in the layout content.
   *
   * @default /<Outlet[ \t]*?\/>/
   */
  placeholder?: string | RegExp
}

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

    return isAsync
      ? fsp.readFile(source, 'utf8').then(content => {
          return pupa(content, data, { ignoreMissing: true }).replace(
            placeholder,
            html
          )
        })
      : pupa(fs.readFileSync(source, 'utf8'), data, {
          ignoreMissing: true
        }).replace(placeholder, html)
  }
}

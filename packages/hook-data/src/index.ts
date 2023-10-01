import { basename, extname } from 'node:path'
import fg from 'fast-glob'
import { loadFile, loadFileSync } from 'loadee'
import type { MarkdownHook } from 'marked-sequential-hooks'
import { isBrowser, isSpecificSources } from './utils.js'

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to load additional data from files or objects
 * and attach it to the marked hooks context.
 *
 * @param arg - A string specifying file patterns or an object containing
 *   additional data.
 * @returns A `MarkdownHook` function that processes the Markdown
 *   and attaches additional data.
 *
 * @example
 * Load data from files matching the patterns:
 * ```ts
 * const filePatterns = './data/*.json';
 * const markdownHook = markedHookData(filePatterns);
 * ```
 *
 * Load data from an object:
 * ```ts
 * const dataObject = { key1: 'value1', key2: 'value2' };
 * const markdownHook = markedHookData(dataObject);
 * ```
 */
export default function markedHookData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source?: string | { [key: string]: any }
): MarkdownHook {
  return (markdown, data, isAsync) => {
    const dataPrefix = data.matterDataPrefix as string | false
    const matter = dataPrefix ? (data[dataPrefix] as typeof data) : data

    // use datasource from matter data if provided
    source = matter.datasource ? matter.datasource : source

    if (
      typeof source === 'string' ||
      (Array.isArray(source) && isSpecificSources(source))
    ) {
      if (isBrowser()) {
        console.warn(
          'Loading data from files is not supported in the browser. Data will be ignored.'
        )

        return markdown
      }

      const files = fg.sync(source, { onlyFiles: true })

      for (const file of files) {
        const dataPrefix = basename(file, extname(file))

        Object.assign(data, {
          [dataPrefix]: isAsync ? loadFile(file) : loadFileSync(file)
        })
      }
    } else if (typeof source === 'object') {
      Object.assign(data, Array.isArray(source) ? { unknown: source } : source)
    }

    return markdown
  }
}

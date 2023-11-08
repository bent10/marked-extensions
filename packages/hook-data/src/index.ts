import { dirname } from 'path'
import type { MarkdownHook } from 'marked-sequential-hooks'
import getAncestor from 'common-ancestor-path'
import fg from 'fast-glob'
import {
  isBrowser,
  isSpecificSources,
  retrieveData,
  retrieveDataSync
} from './utils.js'

type DataWithAdditionalProps = {
  [key: string]: unknown
  datasources?: string[]
  datasourcesAncestor?: string | null
  matterDataPrefix?: string | false
}

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to load additional data from files or objects
 * and attach it to the marked hooks context.
 *
 * @param source - A string specifying file patterns or an object containing additional data.
 * @param merge - A boolean indicating whether to merge additional data with existing data.
 * @returns A `MarkdownHook` function that processes the Markdown and attaches additional data.
 */
export default function markedHookData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: string | string[] | { [key: string]: unknown } = {},
  merge = true
): MarkdownHook {
  return (markdown, data: DataWithAdditionalProps, isAsync) => {
    const { matterDataPrefix } = data
    const matter = matterDataPrefix
      ? (data[matterDataPrefix] as { [key: string]: unknown })
      : data

    // use datasource from matter data if provided
    source = matter.datasource ? (matter.datasource as typeof source) : source

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

      data.datasources = fg
        .sync(source, { onlyFiles: true })
        .map(p => p.replace(/^\.*?\//g, ''))
      data.datasourcesAncestor =
        data.datasources.length > 1
          ? getAncestor(...data.datasources)
          : dirname(data.datasources[0])

      return isAsync
        ? retrieveData(data, markdown, merge)
        : retrieveDataSync(data, markdown, merge)
    }

    if (typeof source === 'object') {
      Object.assign(data, Array.isArray(source) ? { unknown: source } : source)
    }

    return markdown
  }
}

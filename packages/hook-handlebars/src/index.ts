import Handlebars from 'handlebars'
import type { HtmlHook } from 'marked-sequential-hooks'

export interface Options extends Handlebars.RuntimeOptions {}

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support [Handlebars](https://handlebarsjs.com/) in Markdown
 * documents.
 */
export default function markedHookHandlebars(
  context?: unknown,
  options: Options = {}
): HtmlHook {
  return (html, data) => {
    Object.assign(data, context)
    const template = Handlebars.compile(html)

    return template(data, options)
  }
}

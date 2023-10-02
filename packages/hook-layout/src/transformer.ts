import fs, { promises as fsp } from 'node:fs'
import moo from 'moo'
import pupa from 'pupa'
import type { TransformerOptions } from './types.js'

/**
 * The lexer used for tokenizing templates.
 */
const lexer = moo.compile({
  placeholder: {
    match: /{[ \t]*?(?:[a-zA-Z_][\w\d\.]*?|[\d][\w\d\.]+)[ \t]*?}/,
    value(x) {
      return x.replace(/[ \t]+/g, '')
    }
  },
  chunk: moo.fallback
})

/**
 * Transforms a template using the provided options.
 *
 * @param source - The source of the template.
 * @param options - The transformation options.
 * @returns The transformed template.
 */
export function transform(
  source: string,
  options: TransformerOptions & { isAsync?: boolean }
) {
  const { isAsync, ...opts } = options

  return isAsync ? transformAsync(source, opts) : transformSync(source, opts)
}

/**
 * Asynchronously transforms a template using the provided options.
 *
 * @param source - The source of the template.
 * @param options - The transformation options.
 * @returns A Promise that resolves to the transformed template.
 */
async function transformAsync(source: string, options: TransformerOptions) {
  const template = await fsp.readFile(source, 'utf8')

  return applyLayout(template, options)
}

/**
 * Synchronously transforms a template using the provided options.
 *
 * @param source - The source of the template.
 * @param options - The transformation options.
 * @returns The transformed template.
 */
function transformSync(source: string, options: TransformerOptions) {
  const template = fs.readFileSync(source, 'utf8')

  return applyLayout(template, options)
}

/**
 * Applies the layout to a template using the provided options.
 *
 * @param template - The template to apply the layout to.
 * @param options - The transformation options.
 * @returns The template with the layout applied.
 */
function applyLayout(template: string, options: TransformerOptions) {
  lexer.reset(template)
  const { content, data, placeholder, interpolation } = options
  let normalizedTemplate = ''

  for (const token of lexer) {
    normalizedTemplate += token.value
  }

  const interpolatedTemplate = interpolation
    ? interpolate(normalizedTemplate, data)
    : template

  return interpolatedTemplate.replace(placeholder, content)
}

/**
 * Interpolates data into a template using Pupa.
 *
 * @param template - The template to interpolate data into.
 * @param data - The data to interpolate.
 * @returns The template with data interpolated.
 */
function interpolate(template: string, data: TransformerOptions['data']) {
  return pupa(template, data, {
    ignoreMissing: true
  })
}

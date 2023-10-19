import fs, { promises as fsp } from 'node:fs'
import type { TransformerOptions } from './types.js'


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
  const { content, placeholder } = options

  return template.replace(placeholder, content)
}

import type { Token, TokensList } from 'marked'

/**
 * Options for configuring the markedCodePreview extension.
 */
export interface Options {
  /**
   * The code preview template to use.
   */
  template?: string

  /**
   * Data to interpolate into template.
   */
  data?: { [key: string]: unknown }

  /**
   * By default, It throws a `MissingValueError` when a placeholder
   * resolves to `undefined`. With this option set to `true`, it simply ignores
   * it and leaves the placeholder as is.
   */
  ignoreMissing?: boolean

  /**
   * Performs arbitrary operation for each interpolation. If the returned value
   * was `undefined`, it behaves differently depending on the
   * `ignoreMissing` option. Otherwise, the returned value will be
   * interpolated into a string (and escaped when double-braced) and
   * embedded into the template.
   *
   * @default ({value}) => value
   */
  transform?: (data: { value: unknown; key: string }) => unknown
}

/**
 * Configuration options for the transformation.
 */
export interface TransformOptions extends Options {
  index: number
  parent: Token[] | TokensList
}

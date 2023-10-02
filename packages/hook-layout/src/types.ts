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
   * The name of the layout to use, it can be specified with or without the
   * `.html` suffix.
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

  /**
   * Specifies whether interpolation should be performed when applying the
   * layout.
   *
   * @default true
   */
  interpolation?: boolean
}

/**
 * Represents the options for the `transform` function.
 */
export interface TransformerOptions {
  /**
   * The data to interpolate into the template.
   */
  data: { [key: string]: unknown }

  /**
   * The content to insert into the layout.
   */
  content: string

  /**
   * Specifies whether interpolation should be performed when applying the
   * layout.
   */
  interpolation: boolean

  /**
   * The placeholder to replace in the layout content.
   */
  placeholder: string | RegExp
}

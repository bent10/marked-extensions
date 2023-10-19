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
}

/**
 * Represents the options for the `transform` function.
 */
export interface TransformerOptions extends Pick<Required<Options>, 'placeholder'> {
  /**
   * The content to insert into the layout.
   */
  content: string
}

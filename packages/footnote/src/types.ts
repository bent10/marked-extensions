import type { Token } from 'marked'

/**
 * Represents the options for the `markedFootnote` function.
 */
export interface Options {
  /**
   * The prefix ID for footnotes.
   *
   * @default 'footnote-'
   */
  prefixId?: string

  /**
   * The prefix for the main data attribute for footnotes.
   *
   * @default ''
   */
  prefixData?: string

  /**
   * The description of footnotes, used by `aria-labeledby` attribute.
   *
   * @default 'Footnotes'
   */
  description?: string

  /**
   * If set to `true`, it will place footnote reference in square brackets, like this:
   * `[1]`.
   *
   * @default false
   */
  refMarkers?: boolean

  /**
   * If set to `true`, it will insert a horizontal rule above the footnotes at the bottom of the page.
   *
   * @default false
   */
  footnoteDivider?: boolean

  /**
   * The CSS class set to the element wrapping all footnotes at the bottom of the page. Can be set to an empty string to remove the CSS class.
   *
   * @default 'footnotes'
   */
  sectionClass?: string

  /**
   * The CSS class set to the heading element introducing the footnotes at the bottom of the page for screen reader users. Can be set to an empty string to remove the CSS class.
   *
   * @default 'sr-only'
   */
  headingClass?: string

  /**
   * ARIA label of the links referring back to the location in the text of the page where the footnote has been referred from. The placeholder `{0}` will be replaced by the footnote marker text.
   *
   * @default 'Back to reference {0}'
   */
  backRefLabel?: string
}

/**
 * Represents a collection of footnotes.
 */
export type Footnotes = {
  type: 'footnotes'
  raw: string
  rawItems: Footnote[]
  items: Footnote[]
}

/**
 * Represents a single footnote.
 */
export type Footnote = {
  type: 'footnote'
  raw: string
  label: string
  refs: FootnoteRef[]
  content: Token[]
}

/**
 * Represents a reference to a footnote.
 */
export type FootnoteRef = {
  type: 'footnoteRef'
  raw: string
  id: string
  label: string
}

export type LexerTokens = {
  hasFootnotes: boolean
  tokens: Token[]
}

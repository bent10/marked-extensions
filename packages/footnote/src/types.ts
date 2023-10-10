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
}

/**
 * Represents a collection of footnotes.
 */
export type Footnotes = {
  type: 'footnotes'
  raw: string
  items: Footnote[]
}

/**
 * Represents a single footnote.
 */
export type Footnote = {
  type: 'footnote'
  raw: string
  label: string
  content: Token[]
}

/**
 * Represents a reference to a footnote.
 */
export type FootnoteRef = {
  type: 'footnoteRef'
  raw: string
  label: string
}

export type LexerTokens = {
  hasFootnotes: boolean
  tokens: Token[]
}

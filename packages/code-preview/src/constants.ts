/**
 * The default code preview template.
 */
export const DEFAULT_TEMPLATE = `
<figure class='preview'>
  <figcaption>{title}</figcaption>
  <div class='preview-showcase'>
    {preview}
  </div>
  <div class='preview-code'>
    {code}
  </div>
</figure>
`

export const ATTR_PATTERN =
  /\s*preview(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?$|preview(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?\s*/g

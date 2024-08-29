/**
 * Map a markdown code fence language to the corresponding Prettier
 * `parser` name.
 */
export const LANG_MAP = {
  javascript: 'babel',
  js: 'babel',
  node: 'babel',
  jsx: 'babel',
  javascriptreact: 'babel',
  react: 'babel',
  typescript: 'babel-ts',
  ts: 'babel-ts',
  tsx: 'babel-ts',
  flow: 'babel-flow',
  css: 'css',
  scss: 'scss',
  less: 'less',
  handlebars: 'glimmer',
  json: 'json',
  jsonc: 'json',
  geojson: 'json',
  jsonl: 'json',
  topojson: 'json',
  json5: 'json5',
  'json.stringify': 'json-stringify',
  graphql: 'graphql',
  pandoc: 'markdown',
  markdown: 'markdown',
  md: 'markdown',
  mdx: 'mdx',
  html: 'html',
  xhtml: 'html',
  vue: 'vue',
  angular: 'angular',
  lwc: 'lwc',
  yaml: 'yaml',
  yml: 'yaml',
  ansible: 'yaml',
  'home-assistant': 'yaml'
}

/**
 * Extended language map for additional code fence languages and their
 * Prettier parser names.
 */
export const EXTENDED_LANG_MAP = {
  php: 'php',
  inc: 'php',
  pug: 'pug',
  jade: 'pug',
  ruby: 'ruby',
  jruby: 'ruby',
  macruby: 'ruby',
  rb: 'ruby',
  rbx: 'ruby',
  xml: 'xml',
  rss: 'xml',
  xsd: 'xml',
  wsdl: 'xml',
  apex: 'apex-anonymous',
  astro: 'astro',
  elm: 'elm',
  erb: 'erb',
  rhtml: 'erb',
  'html+ruby': 'erb',
  glsl: 'glsl-parser',
  gohtml: 'go-template',
  gotmpl: 'go-template',
  java: 'java',
  jsonata: 'JSONata',
  kotlin: 'kotlin',
  kt: 'kotlin',
  ktm: 'kotlin',
  kts: 'kotlin',
  motoko: 'motoko-tt-parse',
  mo: 'motoko-tt-parse',
  nginx: 'nginx',
  prisma: 'prisma-parse',
  properties: 'dot-properties',
  ini: 'dot-properties',
  dosini: 'dot-properties',
  rust: 'jinx-rust',
  rs: 'jinx-rust',
  sql: 'sql',
  solidity: 'solidity-parse',
  sol: 'solidity-parse',
  svelte: 'svelte',
  toml: 'toml'
}

export const ATTR_PATTERN =
  /\s*prettier(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?$|prettier(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?\s*/g

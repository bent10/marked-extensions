# marked-shiki

A [marked](https://marked.js.org/) extension for [Shiki](https://shiki.style/).

- [Install](#install)
- [Usage](#usage)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [API](#api)
  - [`markedShiki(options: Options): MarkedExtension`](#markedshikioptions-options-markedextension)
- [Related](#related)
- [Contributing](#contributing)
- [License](#license)

## Install

You can install `marked-shiki` using npm or yarn:

```bash
npm i marked-shiki shiki
# or
yarn add marked-shiki shiki
```

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

### Browser

Please take a moment to review the [`index.html`](https://github.com/bent10/marked-extensions/blob/main/packages/shiki/index.html) file.

[![See marked-shiki on RunKit](https://badge.runkitcdn.com/marked-shiki.svg)](https://untitled-zkqkgcjhm23s.runkit.sh/)

### Node.js

Say we have the following file `example.md`:

<details>
<summary>`example.md`</summary>

`````md
# Example

A [marked](https://marked.js.org/) A marked extension for [Shiki](https://shiki.style/).

## Transformers

### `transformerNotationDiff`

Use `[!code ++]` and `[!code --]` to mark added and removed lines.

For example, the following code

````md
```js
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

will be transformed to

```js
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

### `transformerNotationHighlight`

Use `[!code highlight]` to highlight a line (adding `highlighted` class).

````md
```js
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

Results in

```js
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

Alternatively, you can use the [`transformerMetaHighlight`](#transformermetahighlight) to highlight lines based on the meta string.

### `transformerNotationWordHighlight`

Use `[!code word:xxx]` to highlight a word (adding `highlighted-word` class).

````md
```js
export function foo() {
  // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

Results in

```js
export function foo() {
  // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```

You can also specify the number of occurrences to highlight, e.g. `[!code word:options:2]` will highlight the next 2 occurrences of `options`.

````md
```js
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```
````

```js
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```

### `transformerNotationFocus`

Use `[!code focus]` to focus a line (adding `focused` class).

````md
```js
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

Results in

```js
export function foo() {
  console.log('Focused') // [!code focus]
}
```

### `transformerNotationErrorLevel`

Use `[!code error]`, `[!code warning]`, to mark a line with an error level (adding `highlighted error`, `highlighted warning` class).

````md
```js
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

Results in

```js
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

### `transformerMetaHighlight`

Highlight lines based on the meta string provided on the code snippet. Requires integrations supports.

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

Results in

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

### `transformerMetaWordHighlight`

Highlight words based on the meta string provided on the code snippet. Requires integrations supports.

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
```
````

Results in

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```
`````

</details>

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedShiki from 'marked-shiki'
import { createHighlighter } from 'shiki'
// npm i @shikijs/transformers
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight
} from '@shikijs/transformers'

const highlighter = await createHighlighter({
  // In this case, we include the "js" language specifier to ensure that
  // Shiki applies the appropriate syntax highlighting for Markdown code
  // blocks.
  langs: ['md', 'js'],
  themes: ['github-dark-dimmed']
})

const html = await new Marked()
  .use(
    markedShiki({
      highlight(code, lang, props) {
        return highlighter.codeToHtml(code, {
          lang,
          theme: 'github-dark-dimmed',
          meta: { __raw: props.join(' ') }, // required by `transformerMeta*`
          transformers: [
            transformerNotationDiff({
              matchAlgorithm: 'v3'
            }),
            transformerNotationHighlight({
              matchAlgorithm: 'v3'
            }),
            transformerNotationWordHighlight({
              matchAlgorithm: 'v3'
            }),
            transformerNotationFocus({
              matchAlgorithm: 'v3'
            }),
            transformerNotationErrorLevel({
              matchAlgorithm: 'v3'
            }),
            transformerMetaHighlight(),
            transformerMetaWordHighlight()
          ]
        })
      }
    })
  )
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

<details>
<summary>See result:</summary>

````html
<h1>Example</h1>
<p>
  A <a href="https://marked.js.org/">marked</a> A marked extension for
  <a href="https://shiki.style/">Shiki</a>.
</p>
<h2>Transformers</h2>
<h3><code>transformerNotationDiff</code></h3>
<p>
  Use <code>[!code ++]</code> and <code>[!code --]</code> to mark added and
  removed lines.
</p>
<p>For example, the following code</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'hewwo'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code --]</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'hello'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code ++]</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>will be transformed to</p>
<pre
  class="shiki github-dark-dimmed has-diff"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line diff remove"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'hewwo'</span><span style="color:#ADBAC7">) </span></span>
<span class="line diff add"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'hello'</span><span style="color:#ADBAC7">) </span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>
<h3><code>transformerNotationHighlight</code></h3>
<p>
  Use <code>[!code highlight]</code> to highlight a line (adding
  <code>highlighted</code> class).
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Highlighted'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code highlight]</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed has-highlighted"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line highlighted"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Highlighted'</span><span style="color:#ADBAC7">) </span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>
<p>
  Alternatively, you can use the
  <a href="#transformermetahighlight"><code>transformerMetaHighlight</code></a>
  to highlight lines based on the meta string.
</p>
<h3><code>transformerNotationWordHighlight</code></h3>
<p>
  Use <code>[!code word:xxx]</code> to highlight a word (adding
  <code>highlighted-word</code> class).
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#768390">  // [\!code word:Hello]</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> msg</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> 'Hello World'</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(msg) </span><span style="color:#768390">// prints Hello World</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> msg</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> '</span><span style="color:#96D0FF" class="highlighted-word">Hello</span><span style="color:#96D0FF"> World'</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(msg) </span><span style="color:#768390">// prints </span><span style="color:#768390" class="highlighted-word">Hello</span><span style="color:#768390"> World</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>
<p>
  You can also specify the number of occurrences to highlight, e.g.
  <code>[!code word:options:2]</code> will highlight the next 2 occurrences of
  <code>options</code>.
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#768390">// [\!code word:options:2]</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> options</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> { foo: </span><span style="color:#96D0FF">'bar'</span><span style="color:#ADBAC7"> }</span></span>
<span class="line"><span style="color:#ADBAC7">options.foo </span><span style="color:#F47067">=</span><span style="color:#96D0FF"> 'baz'</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(options.foo) </span><span style="color:#768390">// this one will not be highlighted</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> </span><span style="color:#6CB6FF" class="highlighted-word">options</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> { foo: </span><span style="color:#96D0FF">'bar'</span><span style="color:#ADBAC7"> }</span></span>
<span class="line"><span style="color:#ADBAC7" class="highlighted-word">options</span><span style="color:#ADBAC7">.foo </span><span style="color:#F47067">=</span><span style="color:#96D0FF"> 'baz'</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(options.foo) </span><span style="color:#768390">// this one will not be highlighted</span></span></code></pre>
<h3><code>transformerNotationFocus</code></h3>
<p>
  Use <code>[!code focus]</code> to focus a line (adding
  <code>focused</code> class).
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Focused'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code focus]</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed has-focused"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line focused"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Focused'</span><span style="color:#ADBAC7">) </span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>
<h3><code>transformerNotationErrorLevel</code></h3>
<p>
  Use <code>[!code error]</code>, <code>[!code warning]</code>, to mark a line
  with an error level (adding <code>highlighted error</code>,
  <code>highlighted warning</code> class).
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">error</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Error'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code error]</span></span>
<span class="line"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">warn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Warning'</span><span style="color:#ADBAC7">) </span><span style="color:#768390">// [\!code warning]</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed has-highlighted"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> foo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line highlighted error"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">error</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Error'</span><span style="color:#ADBAC7">) </span></span>
<span class="line highlighted warning"><span style="color:#ADBAC7">  console.</span><span style="color:#DCBDFB">warn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'Warning'</span><span style="color:#ADBAC7">) </span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>
<h3><code>transformerMetaHighlight</code></h3>
<p>
  Highlight lines based on the meta string provided on the code snippet.
  Requires integrations supports.
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js {1,3-4}</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'1'</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'2'</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'3'</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'4'</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line highlighted"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'1'</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'2'</span><span style="color:#ADBAC7">)</span></span>
<span class="line highlighted"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'3'</span><span style="color:#ADBAC7">)</span></span>
<span class="line highlighted"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">'4'</span><span style="color:#ADBAC7">)</span></span></code></pre>
<h3><code>transformerMetaWordHighlight</code></h3>
<p>
  Highlight words based on the meta string provided on the code snippet.
  Requires integrations supports.
</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#ADBAC7">```js /Hello/</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> msg</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> 'Hello World'</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(msg)</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(msg) </span><span style="color:#768390">// prints Hello World</span></span>
<span class="line"><span style="color:#ADBAC7">```</span></span></code></pre>
<p>Results in</p>
<pre
  class="shiki github-dark-dimmed"
  style="background-color:#22272e;color:#adbac7"
  tabindex="0"
><code><span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> msg</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> '</span><span style="color:#96D0FF" class="highlighted-word">Hello</span><span style="color:#96D0FF"> World'</span></span>
<span class="line"><span style="color:#ADBAC7">console.</span><span style="color:#DCBDFB">log</span><span style="color:#ADBAC7">(msg) </span><span style="color:#768390">// prints </span><span style="color:#768390" class="highlighted-word">Hello</span><span style="color:#768390"> World</span></span></code></pre>
````

</details>

<details>
<summary>See related styles:</summary>

This is just a simple example of CSS that you can apply. Feel free to customize it according to your needs.

```css
pre.shiki {
  position: relative;
  z-index: 1;
  padding: 1.5rem 0;
  background: transparent;
  border-radius: 0.5rem;
}

pre.shiki code {
  display: block;
  padding: 0 1.5rem;
  transition: color 0.5s;
}

.shiki.has-focused .line:not(.focused) {
  opacity: 0.7;
  transition:
    filter 0.35s,
    opacity 0.35s;
  filter: blur(1.25px);
}

.shiki.has-focused:focus .line:not(.focused),
.shiki.has-focused:hover .line:not(.focused) {
  opacity: 1;
  filter: blur(0);
}

.shiki code .diff,
.shiki code .highlighted {
  transition: background-color 0.5s;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  width: 100%;
  display: inline-block;
}

.shiki code .diff::before {
  position: absolute;
  left: 10px;
}

.shiki code .diff.add {
  background-color: rgba(70, 149, 74, 0.15);
}

.shiki code .diff.add::before {
  content: '+';
  color: #57ab5a;
}

.shiki code .diff.remove {
  background-color: rgba(229, 83, 75, 0.1);
  opacity: 0.7;
}

.shiki code .diff.remove::before {
  content: '-';
  color: #f47067;
}

.shiki code .highlighted {
  background-color: rgba(99, 110, 123, 0.1);
}

.shiki code .highlighted.error {
  background-color: rgba(229, 83, 75, 0.15);
}

.shiki code .highlighted.warning {
  background-color: rgba(174, 124, 20, 0.15);
}

.shiki .highlighted-word {
  background-color: rgba(65, 132, 228, 0.4);
  border: 1px solid rgba(65, 132, 228, 0.6);
  padding: 1px 3px;
  margin: -1px -3px;
  border-radius: 4px;
}
```

</details>

## API

### `markedShiki(options: Options): MarkedExtension`

This function creates a Marked extension that integrates Shiki for syntax highlighting.

```js
import { marked } from 'marked'
import markedShiki from 'marked-shiki'
import { codeToHtml } from 'shiki'

const html = await marked.use(
  markedShiki({
    async highlight(code, lang) {
      return await codeToHtml(code, { lang, theme: 'min-light' })
    },
    container: `<figure class="highlighted-code">
<button class="btn-copy">Copy</button>
%s
</figure>
`
  }).parse(md)
)
```

`options`: An object containing the following properties:

- `highlight`: A function that formats and highlights the code according to a specific coding style or convention.
- `container` (optional): A string representing the HTML container for the highlighted code. Default is `'%s'`.

  Below are the available template placeholders:

  - `%s`: Represents the highlighted code.
  - `%t`: Represents the original code.
  - `%l`: Represents the language.

## Related

See [extensions list](https://github.com/bent10/marked-extensions#packages).

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## License

![GitHub](https://img.shields.io/github/license/bent10/marked-extensions)

A project by [Stilearning](https://stilearning.com) &copy; 2023-2024.

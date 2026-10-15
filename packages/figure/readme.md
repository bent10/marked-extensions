# marked-figure

A [marked](https://marked.js.org/) extension that renders an image standing alone in its paragraph as a `<figure>`, using the alt text as its caption.

- [Install](#install)
- [Usage](#usage)
- [Accessibility](#accessibility)
- [Related](#related)
- [Contributing](#contributing)
- [License](#license)

## Install

You can install `marked-figure` using npm or yarn:

```bash
npm i marked-figure
# or
yarn add marked-figure
```

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

Say we have the following file `example.md`:

```md
# Example

![A *sleepy* cat](cat.png)

![](divider.png)

An inline ![icon](icon.png) stays in its paragraph.
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedFigure from 'marked-figure'

const html = new Marked()
  .use(markedFigure())
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Example</h1>
<figure>
  <img src="cat.png" alt="A sleepy cat" />
  <figcaption aria-hidden="true">A <em>sleepy</em> cat</figcaption>
</figure>
<figure><img src="divider.png" alt="" /></figure>
<p>An inline <img src="icon.png" alt="icon" /> stays in its paragraph.</p>
```

Only a paragraph whose sole content is an image becomes a figure, since a `<figure>` is not allowed inside a `<p>`. An image with empty alt text gets no `<figcaption>`.

## Accessibility

The caption repeats the alt text, so it is marked `aria-hidden="true"`: screen readers announce the image's alt text once instead of twice.

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

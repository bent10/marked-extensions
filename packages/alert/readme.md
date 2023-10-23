# marked-alert

A [marked](https://marked.js.org/) extension to support [GFM alerts](https://github.com/orgs/community/discussions/16925).

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
  - [Default Alert Variants](#default-alert-variants)
- [Related](#related)
- [Contributing](#contributing)
- [License](#license)

## Install

You can install `marked-alert` using npm or yarn:

```bash
npm i marked-alert
# or
yarn add marked-alert
```

## Usage

[![Try marked-alert on RunKit](https://badge.runkitcdn.com/marked-alert.svg)](https://untitled-fmwk1u13dn8y.runkit.sh/)

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

Say we have the following file `example.md`:

```md
# Example

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

Old syntax:

> **Note**
> This is a note

> **Important**
> This is a important

> **Warning**
> This is a warning
```

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedAlert from 'marked-alert'

const html = new Marked()
  .use(markedAlert())
  .parse(readFileSync('example.md', 'utf8'))

console.log(html)
```

Now, running node `example.js` yields:

```html
<h1>Example</h1>
<div class="markdown-alert markdown-alert-note">
  <p>
    <span
      class="color-fg-accent text-semibold d-inline-flex flex-items-center mb-1"
      ><svg
        class="octicon octicon-info mr-2"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
        ></path></svg
      >Note</span
    ><br />Highlights information that users should take into account, even when
    skimming.
  </p>
</div>
<div class="markdown-alert markdown-alert-important">
  <p>
    <span
      class="color-fg-done text-semibold d-inline-flex flex-items-center mb-1"
      ><svg
        class="octicon octicon-report mr-2"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        ></path></svg
      >Important</span
    ><br />Crucial information necessary for users to succeed.
  </p>
</div>
<div class="markdown-alert markdown-alert-warning">
  <p>
    <span
      class="color-fg-attention text-semibold d-inline-flex flex-items-center mb-1"
      ><svg
        class="octicon octicon-alert mr-2"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        ></path></svg
      >Warning</span
    ><br />Critical content demanding immediate user attention due to potential
    risks.
  </p>
</div>
<p>Old syntax:</p>
...
```

## Options

The `markedAlert` extension accepts the following configuration options:

- `className`: A string representing a custom CSS class for the alerts.
- `variants`: An array of alert variants, where each variant is configured with a type, icon, and title class name. This allows you to create different alert types.

### Default Alert Variants

The extension includes default alert variants:

- `note`: Represents a note alert.
- `important`: Represents an important alert.
- `warning`: Represents a warning alert.

Each variant has an associated icon and title class name.

You can customize the default alert variants and add your own. Here's an example:

```js
const options = {
  variants: [
    {
      type: 'danger',
      icon: '<i class="mr-2">🚨</i>',
      titleClassName: 'text-danger' // optional
    }
  ]
}
```

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

A project by [Stilearning](https://stilearning.com) &copy; 2023.

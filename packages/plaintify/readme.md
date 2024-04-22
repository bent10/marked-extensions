# marked-plaintify

A [marked](https://marked.js.org/) extension to convert Markdown to Plaintext.

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [`markedPlaintify(options: Options): MarkedExtension`](#markedplaintifyoptions-options-markedextension)
- [Related](#related)
- [Contributing](#contributing)
- [License](#license)

## Install

You can install `marked-plaintify` using npm or yarn:

```bash
npm i marked-plaintify
# or
yarn add marked-plaintify
```

## Usage

Once you've installed this extension, you can use it in your marked configuration. Here's an example of how to configure it:

Say we have the following file `example.md`:

<details>
<summary>Click to view `example.md`:</summary>

````md
# GitHub Flavored Markdown (GFM) Specifications Demo

This document showcases various features and specifications of GitHub Flavored Markdown (GFM).

## 1. Headings

### This is a third-level heading

#### This is a fourth-level heading

## 2. Emphasis

_This text will be italic_
_This will also be italic_

**This text will be bold**
**This will also be bold**

## 3. Lists

### Unordered List

- Item 1
- Item 2
  - Item 2a
  - Item 2b

### Ordered List

1. First item
2. Second item
3. Third item
   1. Indented item
   2. Indented item

## 4. Links

[Github](https://github.com) - Renders as a link to GitHub.

## 5. Images

![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

## 6. Blockquotes

> This is a blockquote

## 7. Inline code

This is an `inline code` example.

## 8. Code blocks

```javascript
function greet(name) {
  console.log('Hello, ' + name + '!')
}

greet('World')
```

## 9. Strikethrough

~~This text is strikethrough.~~

## 10. Tables

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## 11. Task lists

- [x] Task 1
- [x] Task 2
- [ ] Task 3

## 12. Mentioning users and issues

@username, #123

## 13. Emoji

:smile:, :rocket:, :octocat:

## 14. Automatic linking for URLs

https://www.google.com

## 15. Strikethrough

~~Strikethrough~~

## 16. Ignoring Markdown formatting

\*This will not be italic\*

## 17. Tables

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

## 18. Fenced code blocks with language syntax highlighting

```python
def hello():
    print("Hello, World!")
```

## 19. Disabling line breaks in paragraphs

This is a paragraph that demonstrates how to
disable line breaks.

## 20. Automatic linking for URLs

www.example.com
````

</details>

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'

const plaintext = new Marked({ gfm: true })
  .use(markedPlaintify())
  .parse(readFileSync('example.md', 'utf8'))

console.log(plaintext)
```

Now, running node `example.js` yields:

```text
GitHub Flavored Markdown (GFM) Specifications Demo

This document showcases various features and specifications of GitHub Flavored Markdown (GFM).

1. Headings

This is a third-level heading

This is a fourth-level heading

2. Emphasis

This text will be italic
This will also be italic

This text will be bold
This will also be bold

3. Lists

Unordered List


Item 1
Item 2
Item 2a
Item 2b

Ordered List


First item
Second item
Third item
Indented item
Indented item

4. Links

Github - Renders as a link to GitHub.

5. Images

GitHub Logo

6. Blockquotes

This is a blockquote

7. Inline code

This is an inline code example.

8. Code blocks

function greet(name) {
  console.log('Hello, ' + name + '!')
}

greet('World')

9. Strikethrough

This text is strikethrough.

10. Tables

Column 1: Cell 1
Column 2: Cell 2
Column 3: Cell 3

Column 1: Cell 4
Column 2: Cell 5
Column 3: Cell 6

11. Task lists


Task 1
Task 2
Task 3

12. Mentioning users and issues

@username, #123

13. Emoji

:smile:, :rocket:, :octocat:

14. Automatic linking for URLs

https://www.google.com

15. Strikethrough

Strikethrough

16. Ignoring Markdown formatting

This will not be italic

17. Tables

Markdown: Still
Less: renders
Pretty: nicely

Markdown: 1
Less: 2
Pretty: 3

18. Fenced code blocks with language syntax highlighting

def hello():
    print("Hello, World!")

19. Disabling line breaks in paragraphs

This is a paragraph that demonstrates how to
disable line breaks.

20. Automatic linking for URLs

www.example.com
```

## API

### `markedPlaintify(options: Options): MarkedExtension`

This function creates a `marked` extension to convert Markdown to plaintext.

- `options`: Custom renderers for configuring the `marked-plaintify` extension. It's an object where keys represent renderer names and values are functions that take arguments and return plaintext strings or `false`.

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

# marked-extensions

[Marked](https://marked.js.org/) extensions workspace.

## Install

Follows the steps below to get up and running:

```bash
# clone this repo
> git clone https://github.com/bent10/marked-extensions.git

# go to the project directory and install dependencies
> cd marked-extensions && npm i
```

## Packages

| Package                                                | Description                                                   | Version (click for changelog)                                                                            |
| :----------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------- |
| [marked-code-format](packages/code-format)             | Formatting code blocks using Prettier                         | [![npm](https://img.shields.io/npm/v/marked-code-format)](packages/code-format/changelog.md)             |
| [marked-code-jsx-renderer](packages/code-jsx-renderer) | Render JSX code blocks using a custom renderer and components | [![npm](https://img.shields.io/npm/v/marked-code-jsx-renderer)](packages/code-jsx-renderer/changelog.md) |
| [marked-code-preview](packages/code-preview)           | Transform code blocks into code previews                      | [![npm](https://img.shields.io/npm/v/marked-code-preview)](packages/code-preview/changelog.md)           |
| [marked-sequential-hooks](packages/sequential-hooks)   | Enables the sequential preprocessing and post-processing      | [![npm](https://img.shields.io/npm/v/marked-sequential-hooks)](packages/sequential-hooks/changelog.md)   |

### Sequential hooks

List of [sequential hooks](packages/sequential-hooks) for marked:

| Package                                              | Description                                          | Version (click for changelog)                                                                          |
| :--------------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| [marked-hook-data](packages/hook-data)               | A sequential hook to load data from files or objects | [![npm](https://img.shields.io/npm/v/marked-hook-data)](packages/hook-data/changelog.md)               |
| [marked-hook-frontmatter](packages/hook-frontmatter) | A sequential hook to support frontmatter             | [![npm](https://img.shields.io/npm/v/marked-hook-frontmatter)](packages/hook-frontmatter/changelog.md) |
| [marked-hook-layout](packages/hook-layout)           | A sequential hook that handles layouts               | [![npm](https://img.shields.io/npm/v/marked-hook-layout)](packages/hook-layout/changelog.md)           |

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

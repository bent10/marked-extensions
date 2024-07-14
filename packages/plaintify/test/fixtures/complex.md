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
  - **Item 2b** (bold)
- _Item 3_ (italics)

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

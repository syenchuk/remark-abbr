# @syenchuk/remark-abbr

A tiny, ESM-only [remark](https://github.com/remarkjs/remark) plugin that brings Markdown abbreviations to the latest [unified](https://unifiedjs.com/) stack.

It reads definitions such as `*[HTML]: HyperText Markup Language` and rewrites every matching word into a semantic HTML `<abbr>` element.

## Installation

```sh
npm install @syenchuk/remark-abbr
```

## Usage

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkAbbr from '@syenchuk/remark-abbr'

const file = await unified()
  .use(remarkParse)
  .use(remarkAbbr)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(`Who does maintain HTML?\n\n*[HTML]: HyperText Markup Language\n`)

console.log(String(file))
// → <p>Who does maintain <abbr title="HyperText Markup Language">HTML</abbr>?</p>
```

## Behaviour

- Definitions must live in their own paragraph and follow the `*[ABBR]: Meaning` syntax.
- Abbreviation matches are exact and case-sensitive; words inside inline/fenced code remain untouched.

Example:

```md
The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium
```

Renders to:

```html
<p>The <abbr title="HyperText Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>
```

This is almost identical to Markdown Extra's [abbreviations](https://michelf.ca/projects/php-markdown/extra/#abbr), but empty definitions are not supported.

## Compatibility

This plugin is ESM-only and has been tested with `unified` 11.

It was created to replace [remark-abbr](https://www.npmjs.com/package/remark-abbr) which is outdated, and, as of Sept. 19 2025, only works with “*remark versions lesser than 13.0.0*”.

## Build & Test

If you want to contribute or run tests locally, clone the repo and use:

```sh
make install   # installs dependencies
make test      # runs the Vitest suite
make build     # compiles TypeScript to ESM in dist/
```

## Types

The published bundle ships with type declarations (`dist/index.d.ts`). It defines a new MDAST node type, `Abbr`, which extends `Parent` and is added to `PhrasingContent`.

```
interface Abbr <: Parent {
  type: 'abbr'
  title: string
}
```

## License

ISC © Alexandre Syenchuk

# @syenchuk/remark-abbr

A tiny, ESM-only [remark](https://github.com/remarkjs/remark) plugin that brings Markdown abbreviations to the latest unified stack.

It reads definition paragraphs such as `*[HTML]: HyperText Markup Language` and rewrites every matching word into a semantic `<abbr>` element.

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
  .process(`Who invented HTML?\n\n*[HTML]: HyperText Markup Language\n`)

console.log(String(file))
// → <p>Who invented <abbr title="HyperText Markup Language">HTML</abbr>?</p>
```

## Behaviour

- Definitions must live in their own paragraph and follow the `*[ABBR]: Meaning` syntax.
- Abbreviation matches are exact and case-sensitive; words inside inline/fenced code remain untouched.

## Build & Test

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

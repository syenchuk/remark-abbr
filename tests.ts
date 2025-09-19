import { expect, test } from 'vitest'

import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import remarkAbbr from './src/index'

const pipeline = unified()
  .use(remarkParse)
  .use(remarkAbbr)
  .use(remarkRehype)
  .use(rehypeStringify, {
    characterReferences: { useNamedReferences: true },
  })

async function md2html(md: string): Promise<string> {
  const file = await pipeline.process(md)
  return file.value as string
}

test("replaces two abbreviations", async () => {
  expect(await md2html(
    `The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium
`
  )).toBe(
    `<p>The <abbr title="HyperText Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>`
  )
})

test("replaces one abbreviation with multiple occurrences", async () => {
  expect(await md2html(
    `HTML is HTML.\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p><abbr title="HyperText Markup Language">HTML</abbr> is ` +
    `<abbr title="HyperText Markup Language">HTML</abbr>.</p>`
  )
})

test("doesn't complain with no occurrences of the abbreviation", async () => {
  expect(await md2html(
    `This is a paragraph with no abbreviations.\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p>This is a paragraph with no abbreviations.</p>`
  )
})

test("doesn't complain with no abbreviation definitions", async () => {
  expect(await md2html(
    `This is a paragraph with undefined HTML.\n`
  )).toBe(
    `<p>This is a paragraph with undefined HTML.</p>`
  )
})

test("does not replace inside code", async () => {
  expect(await md2html(
    `This is some code: \`<!doctype HTML>\`\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p>This is some code: <code>&lt;!doctype HTML></code></p>`
  )
})

test("keeps last definition in case of duplicates", async () => {
  expect(await md2html(
    `Who invented HTML?\n\n` +
    `*[HTML]: HyperText Markup Language\n` +
    `*[HTML]: Horrible Text Markup Language\n`
  )).toBe(
    `<p>Who invented <abbr title="Horrible Text Markup Language">HTML</abbr>?</p>`
  )
})

test("is case-sensitive", async () => {
  expect(await md2html(
    `HTML is not html.\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p><abbr title="HyperText Markup Language">HTML</abbr> is not html.</p>`
  )
})

test("works without trailing newline", async () => {
  expect(await md2html(
    `Who invented HTML?\n\n` +
    `*[HTML]: HyperText Markup Language`
  )).toBe(
    `<p>Who invented <abbr title="HyperText Markup Language">HTML</abbr>?</p>`
  )
})

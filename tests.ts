import { expect, test } from 'vitest'

import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import remarkAbbr from 'src/index.ts'

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

test("replaces one abbreviation", async () => {
  expect(await md2html(
    `Who invented HTML?\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p>Who invented <abbr title="HyperText Markup Language">HTML</abbr>?</p>`
  )
})

test("replaces multiple occurrences", async () => {
  expect(await md2html(
    `HTML is HTML.\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p><abbr title="HyperText Markup Language">HTML</abbr> is ` +
    `<abbr title="HyperText Markup Language">HTML</abbr>.</p>`
  )
})

test("works with no occurences of the abbreviation", async () => {
  expect(await md2html(
    `This is a paragraph with no abbreviations.\n\n` +
    `*[HTML]: HyperText Markup Language\n`
  )).toBe(
    `<p>This is a paragraph with no abbreviations.</p>`
  )
})

test("works with no abbreviation definitions", async () => {
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

test("keeps last definition when duplicated", async () => {
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

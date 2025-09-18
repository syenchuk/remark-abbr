import { escapeRegExp } from 'lodash-es'
import { findAndReplace } from 'mdast-util-find-and-replace'
import { remove } from 'unist-util-remove'
import type { ReplaceFunction } from 'mdast-util-find-and-replace'
import type { Root, Paragraph, Node, Parent } from 'mdast'

export interface Abbr extends Parent {
  type: 'abbr'
  title: string
}

declare module 'mdast' {
  interface PhrasingContentMap {
    abbr: Abbr
  }
}

/**
 * This is a remark plugin to support abbreviations in markdown.
 *
 * It looks for definitions of the form `*[HTML]: HyperText Markup Language`
 * and replaces occurrences of `HTML` in the text with
 * `<abbr title="HyperText Markup Language">HTML</abbr>`.
 */
export default function remarkAbbr() {
  return transformer

  function transformer(tree: Root) {
    // finds all abbreviation definitions, deletes them and builds a list of definitions
    const definitions = new Map<string, string>()
    findAndReplace(tree, [
      /\*\[([\w-]+)\]\:\s+(.+)\n?/g,
      ($0: string, $1: string, $2: string) => {
        definitions.set($1, $2)
        return null
      }
    ])

    // builds a list of find-and-replace rules from the definitions and applies them
    const replacements: [RegExp, ReplaceFunction][] = Array.from(
      definitions,
      ([abbreviation, meaning]) => [
        new RegExp(`\\b${escapeRegExp(abbreviation)}\\b`, 'g'),
        () => ({
          type: 'abbr',
          title: meaning,
          children: [
            {
              type: 'text',
              value: abbreviation,
            },
          ],
          data: {
            hName: 'abbr',
            hProperties: {
              title: meaning,
            },
          },
        }),
      ],
    )
    findAndReplace(tree, replacements)

    // removes empty paragraphs that may have been left behind
    remove(tree, (node) => {
      return isEmptyParagraph(node)
    })
  }
}

// helper functions
function isParagraph(node: Node): node is Paragraph {
  return node.type === 'paragraph'
}

function isEmptyParagraph(node: Node): boolean {
  return isParagraph(node) && node.children.length === 0
}

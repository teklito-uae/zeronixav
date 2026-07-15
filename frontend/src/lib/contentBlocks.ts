export type ContentBlock =
  | { type: 'markdown'; key: string; text: string }
  | { type: 'products'; key: string; ids: number[] }

/**
 * Splits markdown content on [[products:1,2,3]] snippets so a product carousel can be
 * rendered exactly where an admin placed it. Content with no snippet yields a single
 * markdown block — the carousel is fully skippable, not an always-on section.
 */
export function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const snippetRe = /\[\[products:([\d,\s]+)]]/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = snippetRe.exec(content)) !== null) {
    const text = content.slice(lastIndex, match.index)
    if (text.trim()) blocks.push({ type: 'markdown', key: `md-${i}`, text })

    const ids = match[1].split(',').map((id) => parseInt(id.trim(), 10)).filter((id) => !Number.isNaN(id))
    blocks.push({ type: 'products', key: `pc-${i}`, ids })

    lastIndex = snippetRe.lastIndex
    i++
  }

  const rest = content.slice(lastIndex)
  if (rest.trim()) blocks.push({ type: 'markdown', key: `md-${i}`, text: rest })

  return blocks
}

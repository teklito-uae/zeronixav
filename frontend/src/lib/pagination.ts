/** Numbered page list with '...' gaps, e.g. [1, '...', 4, 5, 6, '...', 12]. */
export function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 1) return [1]
  const delta = 1
  const range: (number | '...')[] = [1]
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  if (start > 2) range.push('...')
  for (let i = start; i <= end; i++) range.push(i)
  if (end < total - 1) range.push('...')
  range.push(total)

  return range
}

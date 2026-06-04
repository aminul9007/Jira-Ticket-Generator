const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'when', 'after', 'before',
  'into', 'not', 'are', 'was', 'were', 'has', 'have', 'can', 'but', 'all', 'any',
])

export function tokenize(text: string): Set<string> {
  const tokens = new Set<string>()
  for (const word of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length >= 3 && !STOP_WORDS.has(word)) {
      tokens.add(word)
    }
  }
  return tokens
}

export function countTokenOverlap(a: Set<string>, b: Set<string>): number {
  let count = 0
  for (const token of a) {
    if (b.has(token)) count++
  }
  return count
}

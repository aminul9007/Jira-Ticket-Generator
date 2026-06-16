/** Escape a literal keyword for use inside a RegExp. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Whole-word match (case-insensitive). */
export function wordBoundaryPattern(keyword: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i')
}

/** True when `keyword` appears as a standalone word in `text`. */
export function containsStandaloneWord(text: string, keyword: string): boolean {
  if (!keyword.trim()) return false
  return wordBoundaryPattern(keyword).test(text)
}

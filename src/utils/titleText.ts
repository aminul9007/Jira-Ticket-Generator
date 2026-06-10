/** Remove trailing ellipsis artifacts from AI or truncation. */
export function cleanTitleText(text: string): string {
  return text
    .trim()
    .replace(/(?:\.{2,}|…)\s*$/u, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Trim to max length at a word boundary — no ellipsis suffix. */
export function trimTitleAtWord(text: string, max: number): string {
  const cleaned = cleanTitleText(text)
  if (cleaned.length <= max) return cleaned

  const slice = cleaned.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > max * 0.55) {
    return slice.slice(0, lastSpace).trim()
  }

  return slice.trim()
}

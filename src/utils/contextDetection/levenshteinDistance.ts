/** Levenshtein edit distance between two strings. */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const rows = a.length + 1
  const cols = b.length + 1
  const dp: number[] = Array.from({ length: cols }, (_, index) => index)

  for (let row = 1; row < rows; row += 1) {
    let previous = dp[0]
    dp[0] = row

    for (let col = 1; col < cols; col += 1) {
      const temp = dp[col]
      const cost = a[row - 1] === b[col - 1] ? 0 : 1
      dp[col] = Math.min(
        dp[col] + 1,
        dp[col - 1] + 1,
        previous + cost,
      )
      previous = temp
    }
  }

  return dp[cols - 1]
}

/** Normalize a completed voice session into issue-description text. */
export function cleanVoiceTranscript(raw: string, maxLength = 2000): string {
  const collapsed = raw
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim()

  if (!collapsed) return ''

  const capitalized =
    collapsed.charAt(0).toUpperCase() + collapsed.slice(1)

  return capitalized.slice(0, maxLength)
}

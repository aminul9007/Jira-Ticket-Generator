/**
 * Normalizes spoken/written environment phrases before keyword matching.
 * e.g. "production stage" is a colloquial way to say Production — not Staging/Beta.
 */
export function normalizeEnvironmentPhrases(text: string): string {
  return text
    .replace(/\bproduction\s+stage\b/gi, 'production')
    .replace(/\bprod\s+stage\b/gi, 'production')
    .replace(/\bin\s+production\b/gi, 'production')
}

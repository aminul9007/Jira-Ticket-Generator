import { DEFAULT_QA_CONTEXT } from '../data/defaultQaContext'
import type { QaContextSettings } from '../types/qaContext'
import { QA_CONTEXT_STORAGE_KEY } from '../types/qaContext'

function normalizeList(items: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const item of items) {
    const trimmed = item.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

export function normalizeQaContextSettings(
  raw: Partial<QaContextSettings> | null | undefined,
): QaContextSettings {
  if (!raw) return { ...DEFAULT_QA_CONTEXT }

  return {
    productName: raw.productName?.trim() ?? '',
    commonEnvironments: normalizeList(raw.commonEnvironments ?? DEFAULT_QA_CONTEXT.commonEnvironments),
    commonFeatures: normalizeList(raw.commonFeatures ?? []),
    commonBugCategories: normalizeList(
      raw.commonBugCategories ?? DEFAULT_QA_CONTEXT.commonBugCategories,
    ),
  }
}

export function loadQaContextSettings(): QaContextSettings {
  try {
    const raw = localStorage.getItem(QA_CONTEXT_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_QA_CONTEXT }
    return normalizeQaContextSettings(JSON.parse(raw) as Partial<QaContextSettings>)
  } catch {
    return { ...DEFAULT_QA_CONTEXT }
  }
}

export function saveQaContextSettings(settings: QaContextSettings): void {
  try {
    localStorage.setItem(
      QA_CONTEXT_STORAGE_KEY,
      JSON.stringify(normalizeQaContextSettings(settings)),
    )
  } catch {
    /* storage unavailable */
  }
}

export function hasQaContext(settings: QaContextSettings): boolean {
  return (
    settings.productName.length > 0 ||
    settings.commonEnvironments.length > 0 ||
    settings.commonFeatures.length > 0 ||
    settings.commonBugCategories.length > 0
  )
}

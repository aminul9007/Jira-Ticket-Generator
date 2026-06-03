import type { ResolvedTheme, ThemePreference } from '../types/theme'
import { THEME_STORAGE_KEY } from '../types/theme'

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function loadThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemePreference(stored)) return stored
  } catch {
    /* localStorage unavailable */
  }
  return 'system'
}

export function saveThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    /* localStorage unavailable */
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme {
  if (preference === 'system') return systemTheme
  return preference
}

export function applyThemeToDocument(resolved: ResolvedTheme): void {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.dataset.theme = resolved
  root.style.colorScheme = resolved
}

/** Runs before React hydration to avoid theme flash. */
export function initThemeFromStorage(): ThemePreference {
  const preference = loadThemePreference()
  applyThemeToDocument(resolveTheme(preference))
  return preference
}

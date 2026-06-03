export type ThemePreference = 'light' | 'dark' | 'system'

export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: (preference: ThemePreference) => void
}

export const THEME_STORAGE_KEY = 'qa-bug-report-theme'

export const THEME_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system']

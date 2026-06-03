import type { ReactNode } from 'react'
import type { ThemePreference } from '../../types/theme'
import { useTheme } from '../../hooks/useTheme'
import { Dropdown, type DropdownItem } from './Dropdown'

const SunIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const MoonIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
)

const SystemIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 20H16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const preferenceLabels: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

const preferenceIcons: Record<ThemePreference, ReactNode> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
}

export function ThemeToggle() {
  const { preference, resolvedTheme, setTheme } = useTheme()

  const items: DropdownItem[] = (['light', 'dark', 'system'] as ThemePreference[]).map(
    (option) => ({
      id: option,
      label: preferenceLabels[option],
      icon: preferenceIcons[option],
      isActive: preference === option,
      onSelect: () => setTheme(option),
    }),
  )

  const triggerIcon = resolvedTheme === 'dark' ? MoonIcon : SunIcon

  return (
    <Dropdown
      aria-label="Theme settings"
      items={items}
      trigger={
        <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-surface-subtle text-text-secondary transition-colors hover:border-hover-border hover:bg-hover-surface hover:text-text-primary">
          {triggerIcon}
        </span>
      }
    />
  )
}

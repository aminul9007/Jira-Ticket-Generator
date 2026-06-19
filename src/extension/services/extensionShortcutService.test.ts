import { describe, expect, it } from 'vitest'
import { formatShortcutLabel } from './extensionShortcutService'

describe('formatShortcutLabel', () => {
  it('returns Not assigned for empty shortcuts', () => {
    expect(formatShortcutLabel('')).toBe('Not assigned')
    expect(formatShortcutLabel(undefined)).toBe('Not assigned')
  })

  it('formats Chrome shortcut strings for display', () => {
    expect(formatShortcutLabel('Ctrl+Shift+B')).toBe('Ctrl + Shift + B')
    expect(formatShortcutLabel('MacCtrl+Shift+B')).toBe('Cmd + Shift + B')
  })
})

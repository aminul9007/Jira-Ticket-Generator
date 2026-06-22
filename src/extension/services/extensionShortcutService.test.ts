import { describe, expect, it } from 'vitest'
import {
  formatShortcutLabel,
  resolveEffectiveAssistantShortcut,
  type ExtensionCommandInfo,
} from './extensionShortcutService'

describe('formatShortcutLabel', () => {
  it('returns Not assigned for empty shortcuts', () => {
    expect(formatShortcutLabel('')).toBe('Not assigned')
    expect(formatShortcutLabel(undefined)).toBe('Not assigned')
  })

  it('formats Chrome shortcut strings for display', () => {
    expect(formatShortcutLabel('Ctrl+Shift+B')).toBe('Ctrl + Shift + B')
    expect(formatShortcutLabel('MacCtrl+Shift+B')).toBe('Cmd + Shift + B')
    expect(formatShortcutLabel('Alt+Q')).toBe('Alt + Q')
  })
})

describe('resolveEffectiveAssistantShortcut', () => {
  const openAssistant: ExtensionCommandInfo = {
    name: 'open-assistant',
    description: 'Open QA Bug Assistant',
    shortcut: '',
    isAssigned: false,
  }

  const executeAction: ExtensionCommandInfo = {
    name: '_execute_action',
    description: 'Activate extension (toolbar action)',
    shortcut: '',
    isAssigned: false,
  }

  it('prefers open-assistant when it has a shortcut', () => {
    const result = resolveEffectiveAssistantShortcut([
      { ...openAssistant, shortcut: 'Ctrl+Shift+B', isAssigned: true },
      { ...executeAction, shortcut: 'Alt+Q', isAssigned: true },
    ])

    expect(result.isAssigned).toBe(true)
    expect(result.shortcut).toBe('Ctrl+Shift+B')
    expect(result.source).toBe('open-assistant')
  })

  it('falls back to _execute_action when open-assistant is not assigned', () => {
    const result = resolveEffectiveAssistantShortcut([
      openAssistant,
      { ...executeAction, shortcut: 'Alt+Q', isAssigned: true },
    ])

    expect(result.isAssigned).toBe(true)
    expect(result.shortcut).toBe('Alt+Q')
    expect(result.source).toBe('_execute_action')
  })

  it('returns suggested shortcut when nothing is assigned', () => {
    const result = resolveEffectiveAssistantShortcut([openAssistant, executeAction])

    expect(result.isAssigned).toBe(false)
    expect(result.source).toBe('none')
    expect(result.shortcut).toBe('Ctrl+Shift+B')
    expect(result.statusMessage).toContain('No shortcut assigned yet')
  })
})

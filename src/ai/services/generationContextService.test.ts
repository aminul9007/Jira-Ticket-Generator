import { describe, expect, it } from 'vitest'
import { resolveProjectContextSection } from './generationContextService'

describe('generationContextService', () => {
  it('resolveProjectContextSection returns a string', () => {
    const section = resolveProjectContextSection()
    expect(typeof section).toBe('string')
  })
})

import { describe, expect, it } from 'vitest'
import { normalizeProjectKnowledge } from './qaContextStorage'

describe('qaContextStorage', () => {
  it('preserves spaces while typing multi-word text fields', () => {
    const normalized = normalizeProjectKnowledge({
      projectOverview: 'B2B SaaS platform for ',
      productDescription: 'Supports checkout and login flows',
    })

    expect(normalized.projectOverview).toBe('B2B SaaS platform for ')
    expect(normalized.productDescription).toBe('Supports checkout and login flows')
  })

  it('still trims whitespace from list items', () => {
    const normalized = normalizeProjectKnowledge({
      commonFeatures: [' Checkout ', 'Login'],
    })

    expect(normalized.commonFeatures).toEqual(['Checkout', 'Login'])
  })
})

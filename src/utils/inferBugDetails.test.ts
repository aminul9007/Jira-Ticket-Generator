import { describe, expect, it } from 'vitest'
import {
  extractShortTitle,
  inferCategory,
  inferEnvironmentsFromText,
  inferFeature,
  mergeEnvironments,
} from './inferBugDetails'

describe('inferBugDetails', () => {
  it('infers UI bug category from layout keywords', () => {
    expect(inferCategory('Checkout button is misaligned and overlaps footer')).toBe('UI Bug')
  })

  it('infers mobile bug when device keywords dominate', () => {
    expect(inferCategory('Checkout button broken on iPhone Safari')).toBe('Mobile Bug')
  })

  it('infers production environment from text', () => {
    expect(inferEnvironmentsFromText('Happens on production checkout')).toEqual(['Production'])
  })

  it('extracts checkout feature from description', () => {
    expect(inferFeature('Bug on checkout page when submitting payment')).toMatch(/checkout/i)
  })

  it('merges selected and inferred environments without duplicates', () => {
    expect(mergeEnvironments(['Beta'], ['Production', 'Beta'])).toEqual(['Beta', 'Production'])
  })

  it('extracts short title from first sentence', () => {
    expect(extractShortTitle('Pay button broken on Safari.\nMore details here.')).toBe(
      'Pay button broken on Safari.',
    )
  })
})
